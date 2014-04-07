/* Component settings */
var templateUrl = 'coach/uploading-film/instructions.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module Instructions
 */
var Instructions = angular.module('instructions', []);

/* Cache the template file */
Instructions.run([
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
Instructions.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('instructions', {
                url: '',
                parent: 'uploading-film',
                views: {
                    'instructions@uploading-film': {
                        templateUrl: templateUrl,
                        controller: 'InstructionsController'
                    }
                }
            })
            .state('ga-info-instructions', {
                name: 'ga-info-instructions',
                url: '',
                parent: 'ga-info',
                views: {
                    'ga-info-instructions@ga-info': {
                        templateUrl: templateUrl,
                        controller: 'InstructionsController'
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
Instructions.controller('InstructionsController', [
    '$scope', '$state', '$localStorage', 'GAME_STATUSES', 'UploadingFilmTabs', 'GamesFactory',
    function controller($scope, $state, $localStorage, GAME_STATUSES, tabs, games) {

        $scope.$storage = $localStorage;

        $scope.GAME_STATUSES = GAME_STATUSES;

        $scope.save = function() {

            games.save($scope.$storage.game);
            tabs.instructions.active = false;
            tabs['game-info'].active = true;
            $state.go('add-film');
        };
    }
]);

