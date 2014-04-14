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
    function controller($scope, $state, $modal, GAME_STATUSES, games) {

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
                controller: ['$scope', '$modalInstance', 'GamesFactory', '$localStorage', function ($scope, $modalInstance, games, $localStorage) {

                    $scope.$storage = $localStorage;
                    $scope.deleteGame = function () {
                        $scope.$storage.game.isDeleted = true;

                        games.save($scope.$storage.game, function () {
                            $modalInstance.close();
                        }, function () {
                            $modalInstance.close();
                        });
                    };
                }]

            });

        };

    }
]);
