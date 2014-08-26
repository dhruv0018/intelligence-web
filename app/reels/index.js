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
                    '$q', '$state', '$stateParams', 'Reels.Data.Dependencies', 'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'ReelsFactory', 'LeaguesFactory',
                    function dataService($q, $state, $stateParams, data, games, plays, teams, reels, leagues) {

                        var reelId;

                        reelId = Number($stateParams.id);

                        data.reel = reels.load({reelId: reelId});
                        data.games = games.load({reelId: reelId});
                        data.teams = teams.load({reelId: reelId});
                        data.plays = plays.load({reelId: reelId});

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
    '$scope', '$state', '$stateParams', 'Reels.Data', 'PlayManager',
    function controller($scope, $state, $stateParams, data, playManager) {

        $scope.data = data;
        $scope.videoTitle = 'reelsPlayer';
        $scope.editMode = false;
        var editAllowed = true;

        $scope.toggleEditMode = function() {
            //This method is for entering edit mode, or cancelling,
            //NOT for exiting from commiting changes

            if (!editAllowed) return;

            $scope.editMode = !$scope.editMode;

            if ($scope.editMode) {
                //entering edit mode, cache plays array
                if (data.reel && data.reel.plays && angular.isArray(data.reel.plays)) {
                    $scope.toggleEditMode.playsCache = angular.copy(data.reel.plays);
                }
            } else {
                //cancelling edit mode

                if ($scope.toggleEditMode.playsCache) {
                    //get rid of dirty plays array
                    delete data.reel.plays;

                    //in with clean
                    data.reel.plays = $scope.toggleEditMode.playsCache;
                }
            }
        };

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

        $scope.removeReelPlay = function(index) {
            if (data.reel && data.reel.plays && angular.isArray(data.reel.plays)) {
                data.reel.plays.splice(index, 1);
            }
        };

        $scope.saveReels = function() {
            //delete cached plays
            delete $scope.toggleEditMode.playsCache;

            $scope.editMode = false;
            editAllowed = false;

            data.reel.save().then(function() {
                editAllowed = true;
            });
        };
    }
]);

