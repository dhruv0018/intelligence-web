/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * DeleteGame page module.
 * @module DeleteGame
 */
var DeleteGame = angular.module('DeleteGame', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
DeleteGame.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('delete-game.html', template);
    }
]);

/**
 * DeleteGame Modal
 * @module DeleteGame
 * @name DeleteGame.Modal
 * @type {service}
 */
DeleteGame.value('DeleteGame.ModalOptions', {

    templateUrl: 'delete-game.html',
    controller: 'DeleteGame.controller'
});


/**
 * DeleteGame modal dialog.
 * @module DeleteGame
 * @name DeleteGame.Modal
 * @type {service}
 */
DeleteGame.service('DeleteGame.Modal',[
    '$modal', 'DeleteGame.ModalOptions', 'SessionService', 'ROLES',
    function($modal, modalOptions, session, ROLES) {

        var Modal = {

            open: function(game) {
                var resolves = {

                    resolve: {

                        Game: function() { return game; },
                        FilmExchanges: function() {
                            // If a coach, get any film exchanges this game is shared with
                            if (session.getCurrentUser().is(ROLES.COACH)) {
                                let excludeCopiedGames = 1;
                                return game.getFilmExchanges(game.id, excludeCopiedGames).then(filmExchanges => {
                                    return filmExchanges;
                                });
                            }
                        }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

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
 * DeleteGame controller.
 * @module DeleteGame
 * @name DeleteGame.controller
 * @type {controller}
 */
DeleteGame.controller('DeleteGame.controller', [
    '$scope',
    '$state',
    '$modalInstance',
    'GamesFactory',
    'TeamsFactory',
    'Game',
    'FilmExchanges',
    'AlertsService',
    'SessionService',
    'AccountService',
    'ROLES',
    'SPORTS',
    function controller(
        $scope,
        $state,
        $modalInstance,
        games,
        teams,
        game,
        filmExchanges,
        alerts,
        session,
        account,
        ROLES,
        SPORTS
    ) {
        let currentUser = session.getCurrentUser();
        let sport = teams.get(game.teamId).getSport();
        if (currentUser.is(ROLES.COACH)) {
            $scope.sharedFilmExchanges = filmExchanges;
        }

        $scope.deleteGame = function() {
            game.isDeleted = true;

            games.save(game, function() {
                $modalInstance.close();
                if ($scope.adminManagementModal) {
                    $scope.adminManagementModal.close();
                }

                if (currentUser.is(ROLES.ADMIN) || currentUser.is(ROLES.SUPER_ADMIN)) {
                    $state.go('queue').then(successAlert);
                } else if (currentUser.is(ROLES.COACH)) {
                    if (sport.id === SPORTS.FOOTBALL.id || sport.id === SPORTS.VOLLEYBALL.id) {
                        $state.go('Coach.FilmHome').then(successAlert);
                    } else {
                        $state.go('FilmHomeGames').then(successAlert);
                    }
                }
            }, function() {
                alerts.add({
                    type: 'danger',
                    message: 'Your game has failed to delete. Please contact support.'
                });
                $modalInstance.close();

                if ($scope.adminManagementModal) {
                    $scope.adminManagementModal.close();
                }

            });
        };

        function successAlert() {
            alerts.add({
                type: 'success',
                message: 'Your game has been successfully deleted'
            });
        }
    }
]);
