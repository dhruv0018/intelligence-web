/* Component settings */
var templateUrl = 'coach/game-area-information/instructions.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module Instructions
 */
var GameAreaInstructions = angular.module('game-area-instructions', []);

/* Cache the template file */
GameAreaInstructions.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Your Team page state router.
 * @module Instructions
 * @type {UI-Router}
 */
GameAreaInstructions.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('ga-info-instructions', {
                name: 'ga-info-instructions',
                url: '',
                parent: 'ga-info',
                views: {
                    'ga-info-instructions@ga-info': {
                        templateUrl: templateUrl,
                        controller: 'GameAreaInformationInstructionsController'
                    }
                }
            });
    }
]);

/**
 * Instructions controller.
 * @module Instructions
 * @name InstructionsController
 * @type {Controller}
 */
GameAreaInstructions.controller('GameAreaInformationInstructionsController', [
    '$scope', '$state', '$localStorage', 'GAME_STATUSES', 'GameAreaTabs', 'GamesFactory',
    function controller($scope, $state, $localStorage, GAME_STATUSES, tabs, games) {
        $scope.$storage = $localStorage;

        $scope.GAME_STATUSES = GAME_STATUSES;

        $scope.save = function() {
            games.save($scope.$storage.game);
        };
    }
]);

