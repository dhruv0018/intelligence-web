/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/instructions.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module Instructions
 */
var Instructions = angular.module('Coach.Game.Instructions', []);

/* Cache the template file */
Instructions.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Instructions directive.
 * @module Instructions
 * @name Instructions
 * @type {directive}
 */
Instructions.directive('krossoverCoachGameInstructions', [
    function directive() {

        var krossoverCoachGameInstructions = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.Instructions.controller',

            scope: {

                game: '=?'
            }
        };

        return krossoverCoachGameInstructions;
    }
]);
/**
 * Instructions controller.
 * @module Instructions
 * @name Instructions
 * @type {controller}
 */
Instructions.controller('Coach.Game.Instructions.controller', [
    '$scope', '$state', '$localStorage', 'GAME_STATUSES', 'Coach.Game.Tabs', 'Coach.Game.Data', 'GamesFactory',
    function controller($scope, $state, $localStorage, GAME_STATUSES, tabs, data, games) {

        $scope.GAME_STATUSES = GAME_STATUSES;

        $scope.data = data;

        $scope.save = function() {
            games.save($scope.game);
        };
    }
]);

