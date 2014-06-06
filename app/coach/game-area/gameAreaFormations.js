/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Formation Report page module.
 * @module GameArea
 */
var GameAreaFormations = angular.module('game-area-formations', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaFormations.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaFormations.html', require('./gameAreaFormations.html'));
    }
]);

GameAreaFormations.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-formations',
            url: '/formations',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaFormations.html',
                    controller: 'GameAreaFormationsController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaFormations.controller('GameAreaFormationsController', [
    '$scope', '$state', '$stateParams', 'GamesFactory',
    function controller($scope, $state, $stateParams, games) {


    }
]);

