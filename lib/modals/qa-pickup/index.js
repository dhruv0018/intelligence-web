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
    '$scope', '$state', '$modalInstance', 'Utilities', 'GamesFactory', 'Game', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'SessionService',
    function controller($scope, $state, $modalInstance, utilities, games, game, teams, leagues, sports, session) {

        const userId =  session.getCurrentUserId();
        $scope.game = games.get(game);
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

        const league = leagues.get($scope.team.leagueId);
        $scope.sport = sports.get(league.sportId);
        $scope.successfulPickup = false;
        $scope.gameAlreadyTaken = false;

        $scope.pickUpGame = function(pickUpAndGo) {
            //check for update to game and if someone has already
            //picked up the game for qaing

            let updatedGame = games.get(game);
            let currentAssignment = updatedGame.currentAssignment();
            if(currentAssignment.isQa) {
                $scope.gameAlreadyTaken = true;
            } else {
                let uploaderTeam = teams.get($scope.game.uploaderTeamId);
                let deadline = $scope.game.getDeadlineToReturnGame(uploaderTeam);
                $scope.game.assignToQa(userId, deadline);
                $scope.game.save();
                if(pickUpAndGo) {
                    $modalInstance.dismiss();
                    $state.go('indexing', { id: game });
                } else {
                    $scope.successfulPickup = true;
                }
            }
        };

        let refreshPage = () => $state.go('IndexerGamesAvailable');

    }
]);
