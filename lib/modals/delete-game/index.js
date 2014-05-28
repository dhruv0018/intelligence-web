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
    '$modal', 'DeleteGame.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(game) {

                var resolves = {

                    resolve: {

                        Game: function() { return game; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
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
    '$scope', '$state', '$modalInstance', 'GamesFactory', 'Game', 'AlertsService',
    function controller($scope, $state, $modalInstance, games, game, alerts) {

        $scope.deleteGame = function() {
            game.isDeleted = true;

            games.save(game, function() {
                $modalInstance.close();
                $state.go('queue').then(function() {
                    alerts.add({
                        type: 'success',
                        message: 'Your game has been successfully deleted'
                    });
                });
            }, function() {
                alerts.add({
                    type: 'danger',
                    message: 'Your game has failed to delete. Please contact support.'
                });
                $modalInstance.close();
            });
        };
    }
]);

