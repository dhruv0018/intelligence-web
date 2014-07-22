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
                data: '='
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
    '$scope', '$state', 'GAME_STATUSES', 'GamesFactory',
    function controller($scope, $state, GAME_STATUSES, games) {
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.isSaved = false;

        $scope.$watch('data.game', function(game) {
            if (typeof game !== 'undefined' && typeof game.status !== 'undefined' && game.status !== null) {
                $scope.statusBuffer = game.status;
                $scope.isSaved = true;
            } else {
                $scope.statusBuffer = -1;
            }

        });

        $scope.switchChoice = function() {
            $scope.statusBuffer = ($scope.data.game.status === $scope.GAME_STATUSES.NOT_INDEXED.id) ? $scope.GAME_STATUSES.READY_FOR_INDEXING.id : $scope.GAME_STATUSES.NOT_INDEXED.id;
        };

        $scope.save = function() {
            $scope.data.game.status = $scope.statusBuffer;

            if ($scope.data.game.status === GAME_STATUSES.READY_FOR_INDEXING.id) {
                $scope.data.game.submittedAt = new Date().toISOString();
            }

            $scope.data.game.save().then(function(game) {
                $scope.isSaved = true;
            });
        };
    }
]);

