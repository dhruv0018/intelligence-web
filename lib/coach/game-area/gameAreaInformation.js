require('game-area-info');
require('../add-film');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Information page module.
 * @module GameArea
 */
var GameAreaInformation = angular.module('game-area-information', [
    'ui.router',
    'ui.bootstrap',
    'game-area-info',
    'add-film'
]);

GameAreaInformation.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaInformation.html', require('./gameAreaInformation.html'));
    }
]);

GameAreaInformation.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-info',
            url: '',
            parent: 'game-area',
            views: {
                'content@game-area': {
                    templateUrl: 'coach/game-area/gameAreaInformation.html',
                    controller: 'GameAreaInformationController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaInformation.controller('GameAreaInformationController', [
    '$scope', '$state', '$stateParams', 'GameAreaTabs', 'GamesFactory',
    function controller($scope, $state, $stateParams, tabs, games) {
        $scope.tabs = tabs;

        $scope.$watch('tabs', function (tabs) {

            if (tabs['game-info'].active) {
                $state.go('ga-info-basic');
            }

        });

    }
]);