/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Formation Report page module.
 * @module GameArea
 */
var GameAreaDownDistance = angular.module('game-area-down-distance', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaDownDistance.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaDownDistance.html', require('./gameAreaDownDistance.html'));
    }
]);

GameAreaDownDistance.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-down-distance',
            url: '/downanddistance',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaDownDistance.html',
                    controller: 'GameAreaDownDistanceController'
                }
            },
            resolve: {
                'Coach.DownDistance.Data': [
                    '$q', 'Coach.DownDistance.Data',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

/**
 * Coach Down and Distance Data service.
 * @module Game Area Down and Distance
 * @type {service}
 */
GameAreaDownDistance.service('Coach.DownDistance.Data', [
    '$q', 'Coach.Data', 'PlaysFactory',
    function service($q, data, plays) {
        var Data = {
//            data: data,
//            plays: data.then(function(data) {
//                var promisedPlays = $q.defer();
//                plays.getList(data.game.id, function(plays) {
//                    promisedPlays.resolve(plays);
//                }, null, true);
//                return promisedPlays.promise;
//            })
        };

        return Data;
    }
]);

GameAreaDownDistance.controller('GameAreaDownDistanceController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'Coach.DownDistance.Data',
    function controller($scope, $state, $stateParams, games, data) {
        var teamOnOffense = true;
        $scope.plays = data.plays;
        $scope.league = data.data.league;
        $scope.team = data.data.team;
        $scope.teams = data.data.teams;
        $scope.teamId = $scope.game.teamId;
    }
]);

