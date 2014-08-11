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
                    '$q', 'Coach.Data',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaDownDistance.controller('GameAreaDownDistanceController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'Coach.DownDistance.Data',
    function controller($scope, $state, $stateParams, games, data) {
        var teamOnOffense = true;
        $scope.plays = data.plays;
        $scope.league = data.league;
        $scope.teams = data.teams.getCollection();
        $scope.teamId = $scope.game.teamId;
        $scope.opposingTeamId = $scope.game.opposingTeamId;
        $scope.report = data.formationReport;

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
                '4th': '4th'
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
            teamId: $scope.teamId,
            distance: $scope.options.distance[0],
            strength: $scope.options.weight[0],
            redZone: false,
            hash: $scope.options.hash[0],
            down: $scope.options.down[0]
        };

        $scope.createDownAndDistanceReport = function() {

            if ($scope.dndReport.redZone === 'true') {
                $scope.dndReport.redZone = true;
            } else {
                $scope.dndReport.redZone = false;
            }

            if ($scope.dndReport.teamId == $scope.teamId) {
                $scope.dndReport.teamId = $scope.teamId;
            } else if ($scope.dndReport.teamId == $scope.opposingTeamId) {
                $scope.dndReport.teamId = $scope.opposingTeamId;
            }

            games.getDownAndDistanceReport($scope.dndReport).then(function(dndReport) {
                $scope.game.dndReport = dndReport;
            });

        };
    }
]);

