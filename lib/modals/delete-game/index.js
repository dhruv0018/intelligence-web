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
 * DeleteGame modal dialog.
 * @module DeleteGame
 * @name DeleteGame.Modal
 * @type {service}
 */
DeleteGame.service('DeleteGame.Modal', {

    templateUrl: 'delete-game.html',
    controller: 'DeleteGame.controller'
});

/**
 * DeleteGame controller.
 * @module DeleteGame
 * @name DeleteGame.controller
 * @type {controller}
 */
DeleteGame.controller('DeleteGame.controller', [
    '$scope', '$state', '$modalInstance', 'GamesFactory',
    function controller($scope, $state, $modalInstance, games) {
        console.log($scope.game);
//        $scope.deleteGame = function() {
//            $scope.game.isDeleted = true;
//
//            games.save($scope.game, function() {
//                $modalInstance.close();
//                $state.go('Coach.FilmHome');
//            }, function() {
//                $modalInstance.close();
//            });
//        };
    }
]);

