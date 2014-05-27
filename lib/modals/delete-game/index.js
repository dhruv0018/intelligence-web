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
 * @type {value}
 */
DeleteGame.value('DeleteGame.Modal', {

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
    '$scope', '$state', '$modalInstance',
    function controller($scope, $state, $modalInstance) {

    }
]);

