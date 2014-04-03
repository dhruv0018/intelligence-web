require('./gameAreaInformation.js');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area page module.
 * @module GameArea
 */
var GameArea = angular.module('game-area', [
    'ui.router',
    'ui.bootstrap',
    'game-area-information'
]);

/* Cache the template file */
GameArea.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/template.html', require('./template.html'));
    }
]);

/**
 * GameArea page state router.
 * @module AddFilm
 * @type {UI-Router}
 */
GameArea.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'game-area',
            url: '/game-area/:id',
            parent: 'coach',
            views: {
                'main@root': {
                    templateUrl: 'coach/game-area/template.html',
                    controller: 'GameAreaController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameArea.value('GameAreaTabs', {
    'game-info':     { active: true, disabled: false },
    'your-team':     { active: false, disabled: false },
    'opposing-team': { active: false, disabled: false },
    'instructions':    { active: false, disabled: false }
});

/**
 * GameArea controller.
 * @module GameArea
 * @name GameAreaController
 * @type {Controller}
 */
GameArea.controller('GameAreaController', [
    '$scope', '$state', '$stateParams', '$localStorage', 'GamesFactory',
    function controller($scope, $state, $stateParams, $localStorage, games) {
        $scope.gameId = $stateParams.id;

        $scope.$storage = $localStorage;

        games.get($scope.gameId, function(game) {
            $scope.$storage.game = game;
            console.log(game);
        });

        //view selector
        $scope.dataType = 'video';

        $scope.$watch('dataType', function(data){
            if ($scope.dataType === 'game-info') {
                $state.go('ga-info');
            } else {
                $state.go('game-area');
            }

        });
    }
]);


