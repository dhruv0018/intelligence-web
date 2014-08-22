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
                    '$q', '$state', '$stateParams', 'Reels.Data.Dependencies', 'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'ReelsFactory',
                    function dataService($q, $state, $stateParams, data, games, plays, teams, reels) {

                        var reelId;

                        return $q.all(data).then(function(data) {
                            if ($stateParams.id) {
                                reelId = parseInt($stateParams.id);

                                data.reel = reels.fetch(reelId);
                                data.games = games.load({reelId: reelId});
                                data.teams = teams.load({reelId: reelId});
                                data.plays = plays.load({reelId: reelId});

                                return $q.all(data);
                            }
                        });
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

        $scope.data = data;
        $scope.videoTitle = 'reelsPlayer';

        $scope.getHomeTeam = function(playId) {

            if (playId) {
                var gameId = data.plays.get(playId).gameId;
                var teamId = data.games.get(gameId).teamId;

                return data.teams.get(teamId);
            }
        };

        $scope.getOpposingTeam = function(playId) {

            if (playId) {
                var gameId = data.plays.get(playId).gameId;
                var teamId = data.games.get(gameId).opposingTeamId;

                return data.teams.get(teamId);
            }
        };

        $scope.getDatePlayed = function(playId) {

            if (playId) {
                var gameId = data.plays.get(playId).gameId;

                return data.games.get(gameId).datePlayed;
            }
        };

        $scope.data = data;
    }
]);

