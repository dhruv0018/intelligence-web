/* Component resources */
const template = require('./template.html');
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * QaPickup page module.
 * @module QaPickup
 */
const QaPickup = angular.module('QaPickup', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
QaPickup.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('qa-pickup.html', template);
    }
]);

/**
 * QaPickup Modal
 * @module QaPickup
 * @name QaPickup.Modal
 * @type {service}
 */
QaPickup.value('QaPickup.ModalOptions', {

    templateUrl: 'qa-pickup.html',
    controller: 'QaPickup.controller',
    size: 'm'
});


/**
 * QaPickup modal dialog.
 * @module QaPickup
 * @name QaPickup.Modal
 * @type {service}
 */
QaPickup.service('QaPickup.Modal',[
    '$modal', 'QaPickup.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function(game) {
                const resolves = {

                    resolve: {

                        Game: function() { return game; }
                    }
                };

                const options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            },
            setScope: function(scope) {
                modalOptions.scope = scope;
            }
        };

        return Modal;
    }
]);

/**
 * QaPickup controller.
 * @module QaPickup
 * @name QaPickup.controller
 * @type {controller}
 */
QaPickup.controller('QaPickup.controller', [
    '$scope', '$state', '$window', '$modalInstance', 'Utilities', 'GamesFactory', 'Game', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'SessionService', 'VIEWS',
    function controller($scope, $state, $window, $modalInstance, utilities, games, gameId, teams, leagues, sports, session, VIEWS) {

        const currentUserId =  session.getCurrentUserId();
        const now = moment.utc();

        $scope.game = games.get(gameId);
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

        const uploaderTeam = teams.get($scope.game.uploaderTeamId);
        $scope.game.timeRemaining = $scope.game.getRemainingTime(uploaderTeam, now);

        const league = leagues.get($scope.team.leagueId);
        $scope.sport = sports.get(league.sportId);
        $scope.successfulPickup = false;
        $scope.gameAlreadyTaken = false;
        $scope.refreshPage = function() {
            $modalInstance.dismiss();
            $window.location.reload();
        };
        $scope.pickUpGame = function(pickUpAndGo) {
            //check for update to game and if someone has already
            //picked up the game for qaing

            games.fetch(gameId).then(function(updatedGame) {
                let currentAssignment = updatedGame.currentAssignment();
                if(currentAssignment.isQa) {
                    $scope.gameAlreadyTaken = true;
                } else {
                    let deadline;
                    if($scope.game.timeRemaining > 0) {
                        deadline = $scope.game.getDeadlineToReturnGame(uploaderTeam);
                    } else {
                        deadline = now.add(6, 'hours').format();
                    }

                    $scope.game.assignToQa(currentUserId, deadline);
                    $scope.game.save();
                    if(pickUpAndGo) {
                        $modalInstance.dismiss();
                        $state.go('IndexerGame', { id: gameId });
                    } else {
                        $scope.successfulPickup = true;
                    }
                }
            });
        };
    }
]);
