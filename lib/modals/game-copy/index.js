/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * CopyGame page module.
 * @module CopyGame
 */
var CopyGame = angular.module('CopyGame', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
CopyGame.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('copy-game.html', template);
    }
]);

/**
 * CopyGame Modal
 * @module CopyGame
 * @name CopyGame.Modal
 * @type {service}
 */
CopyGame.value('CopyGame.ModalOptions', {

    templateUrl: 'copy-game.html',
    controller: 'CopyGame.controller'
});


/**
 * CopyGame modal dialog.
 * @module CopyGame
 * @name CopyGame.Modal
 * @type {service}
 */
CopyGame.service('CopyGame.Modal',[
    '$modal', 'CopyGame.ModalOptions',
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
            },
            setScope: function(scope) {
                modalOptions.scope = scope;
            }
        };

        return Modal;
    }
]);

/**
 * CopyGame controller.
 * @module CopyGame
 * @name CopyGame.controller
 * @type {controller}
 */
CopyGame.controller('CopyGame.controller', [
    '$scope', '$state', '$modalInstance', 'GamesFactory', 'Game', 'AlertsService',
    function controller($scope, $state, $modalInstance, games, game, alerts) {

        $scope.buttonText = 'Copy now';
        $scope.teamId = null;

        $scope.CopyGame = function() {
            $scope.buttonText = 'Working...';
        };

    }
]);
