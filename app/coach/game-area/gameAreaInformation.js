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
    '$scope', '$state', '$modal', 'AlertsService',
    function controller($scope, $state, $modal, alerts) {
        if ($scope.game.isProcessing()) {
            alerts.add({
                type: 'warning',
                message: 'Your video is still processing. You may still edit the Game Information for this film.'
            });
        } else if ($scope.game.isUploading()) {
            alerts.add({
                type: 'warning',
                message: 'This film is currently uploading. You may still edit the Game Information for this film.'
            });
        }
    }
]);
