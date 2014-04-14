/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Information page module.
 * @module GameArea
 */
var GameAreaInformation = angular.module('game-area-information', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaInformation.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaInformation.html', require('./gameAreaInformation.html'));
        $templateCache.put('coach/game-area/deleteGame.html', require('./deleteGame.html'));
    }
]);

GameAreaInformation.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-info',
            url: '/information',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaInformation.html',
                    controller: 'GameAreaInformationController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaInformation.controller('GameAreaInformationController', [
    '$scope', '$state', '$modal', 'GAME_STATUSES', 'GamesFactory',
    function controller($scope, $state, $modal, $stateParams, GAME_STATUSES, games) {

        $scope.$watch('game', function(game) {

            if (game) {

                var currentAssignment = game.currentAssignment();

                if (currentAssignment) {

                    $scope.isIndexed = $scope.game.status == GAME_STATUSES.INDEXED.id;
                    $scope.returnedDate = currentAssignment.timeFinished;
                }
            }
        });

        $scope.confirmation = function () {
            $modal.open({

                templateUrl: 'coach/game-area/deleteGame.html',
                controller: 'GameAreaInformationController'

            });
        };

        $scope.deleteGame = function () {
            console.log('deleting game');
        };


    }
]);
