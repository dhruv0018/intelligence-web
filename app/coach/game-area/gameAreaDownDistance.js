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
    '$q', 'Coach.Data', 'Coach.Game.Data', 'PlaysFactory',
    function service($q, data, game, plays) {
        var Data = {
            data: data,
            plays: data.then(function(data) {
                var promisedPlays = $q.defer();
                plays.getList(data.game.id, function(plays) {
                    promisedPlays.resolve(plays);
                }, null, true);
                return promisedPlays.promise;
            })
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

        //TODO move to constants
        /*$scope.options = {
            distance: ['short', 'medium', 'long'],
            weight: ['Left', 'Right', 'Balanced'],
            down: ['1st', '2nd', '3rd', '4th'],
            hash: ['Left', 'Right', 'Middle']
        };*/

        $scope.options = {
            'distance': {
                'Any': undefined,
                'Short': 'short',
                'Medium': 'medium',
                'Long': 'long'
            },
            'weight': {
                'Any': undefined,
                'Left': 'Left',
                'Right': 'Right',
                'Balanced': 'Balanced'
            },
            'down': {
                'Any': undefined,
                '1st': '1st',
                '2nd': '2nd',
                '3rd': '3rd',
                '4th': '4th',
            },
            'hash': {
                'Any': undefined,
                'Left': 'Left',
                'Right': 'Right',
                'Middle': 'Middle'
            }
        };

        $scope.dndReport = {
            gameId: $scope.game.id,
            distance: $scope.options.distance[0],
            strength: $scope.options.weight[0],
            redZone: false,
            hash: $scope.options.hash[0],
            down: $scope.options.down[0]
        };


        $scope.createDownAndDistanceReport = function() {
            $scope.dndReport.teamId = $scope.teamId;

            if ($scope.dndReport.redZone === 'true') {
                $scope.dndReport.redZone = true;
            } else {
                $scope.dndReport.redZone = false;
            }

            games.getDownAndDistanceReport($scope.dndReport).then(function(dndReport) {
                $scope.game.dndReport = dndReport;
            });

        };
    }
]);

