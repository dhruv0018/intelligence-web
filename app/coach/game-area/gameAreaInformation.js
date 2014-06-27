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
    '$scope', '$state', '$modal',
    function controller($scope, $state, $modal) {

        $scope.confirmation = function() {
            $modal.open({
                scope: $scope,
                templateUrl: 'coach/game-area/deleteGame.html',
                controller: ['$scope', '$state', '$modalInstance', function($scope, $state, $modalInstance) {
                    $scope.deleteGame = function() {
                        $scope.game.isDeleted = true;

                        $scope.game.save().then(function() {
                            $modalInstance.close();
                            $state.go('Coach.FilmHome');
                        }, function() {
                            $modalInstance.close();
                        });
                    };
                }]

            });

        };

    }
]);
