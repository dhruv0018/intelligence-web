/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Reels Area page module.
 * @module ReelsArea
 */
var ReelsArea = angular.module('ReelsArea', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
ReelsArea.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('reels/template.html', require('./template.html'));
    }
]);

/**
 * ReelsArea page state router.
 * @module ReelsArea
 * @type {UI-Router}
 */
ReelsArea.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('ReelsArea', {
            url: '/reel/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'reels/template.html',
                    controller: 'ReelsArea.controller'
                }
            },
            resolve: {
                'Reels.Data': [
                    '$q', 'Reels.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

ReelsArea.service('Reels.Data.Dependencies', [
    'GamesFactory', 'PlaysFactory', 'TeamsFactory',
    function dataService(games, plays, teams) {

        var Data = {};

        angular.forEach(arguments, function(arg) {

            Data[arg.description] = arg.load();
        });

        return Data;

    }
]);

/**
 * ReelsArea controller.
 * @module ReelsArea
 * @name ReelsAreaController
 * @type {Controller}
 */
ReelsArea.controller('ReelsArea.controller', [
    '$scope', '$state', '$stateParams', 'Reels.Data',
    function controller($scope, $state, $stateParams, data) {

        $scope.getHomeTeam = function(playId) {

            var gameId = data.plays.get(playId).gameId;
            var teamId = data.games.get(gameId).teamId;

            return data.teams.get(teamId);
        };

        $scope.getOpposingTeam = function(playId) {

            var gameId = data.plays.get(playId).gameId;
            var teamId = data.games.get(gameId).opposingTeamId;

            return data.teams.get(teamId);
        };

        $scope.getDatePlayed = function(playId) {
            var gameId = data.plays.get(playId).gameId;

            return data.games.get(gameId).datePlayed;
        };

        $scope.data = data;
        //$scope.reels = {"id":1,"name":"Highschool","uploaderUserId":1,"uploaderTeamId":1,"createdAt":"-0001-11-30T00:00:00+00:00","updatedAt":"-0001-11-30T00:00:00+00:00","plays":[4,3,11,12]};
    }
]);

