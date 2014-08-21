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
    '$state', 'GamesFactory', 'PlaysFactory', 'TeamsFactory',
    function dataService($state, games, plays, teams) {

        var Data = {};
        var reelId;

        if ($state.params.id) {
            reelId = $state.params.id;

            //TODO: get reel
            // Data.reel = reels.get({id: reelId});
            // Data.games = games.load({reelId: reelId});
            // Data.teams = teams.load({reelId: reelId});
            // Data.plays = plays.load({reelId: reelId});
        }

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

        //data.reel = {"id":1,"name":"Highschool","uploaderUserId":1,"uploaderTeamId":1,"createdAt":"-0001-11-30T00:00:00+00:00","updatedAt":"-0001-11-30T00:00:00+00:00","plays":[4,3,11,12]};
        data.reel = {'plays': [1,2,3,4,5,6,7,8,9,10]};

        $scope.getHomeTeam = function(playId) {

            //return {id: 1, name: 'HOME TEAM'};

            var gameId = data.plays.get(playId).gameId;
            var teamId = data.games.get(gameId).teamId;

            return data.teams.get(teamId);
        };

        $scope.getOpposingTeam = function(playId) {

            //return {id: 2, name: 'OPPOSING TEAM'};

            var gameId = data.plays.get(playId).gameId;
            var teamId = data.games.get(gameId).opposingTeamId;

            return data.teams.get(teamId);
        };

        $scope.getDatePlayed = function(playId) {

            //$scope.getDatePlayed.datePlayed = $scope.getDatePlayed.datePlayed || new Date('Wed Aug 20 2014 15:40:30 GMT-0400 (EDT)');

            //return $scope.getDatePlayed.datePlayed;

            var gameId = data.plays.get(playId).gameId;

            return data.games.get(gameId).datePlayed;
        };

        $scope.data = data;
    }
]);

