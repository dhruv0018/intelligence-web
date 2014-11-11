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
                    '$q', '$state', '$stateParams', 'Reels.Data.Dependencies',
                    function dataService($q, $state, $stateParams, data) {

                        return $q.all(data($stateParams).load());
                    }
                ]
            },
            onEnter: [
                '$state', '$stateParams', 'AccountService', 'ReelsFactory',
                function($state, $stateParams, account, reels) {

                    var reelId = Number($stateParams.id);
                    var reel = reels.get(reelId);

                    if (reel.isDeleted) {
                        account.gotoUsersHomeState();
                    }
                }
            ]
        });
    }
]);

ReelsArea.service('Reels.Data.Dependencies', [
    'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'ReelsFactory', 'LeaguesFactory', 'TagsetsFactory',
    function dataService(games, plays, teams, reels, leagues, tagsets) {

        var service = function(stateParams) {

            var obj = {

                load: function() {

                    var reelId = Number(stateParams.id);

                    var data = {
                        reel: reels.fetch(reelId),
                        games: games.load({reelId: reelId}),
                        teams: teams.load({reelId: reelId}),
                        plays: plays.load({reelId: reelId}),
                        tagset: tagsets.load(), // Needed if reels page is directly navigated to through url
                        leagues: leagues.load()
                    };

                    return data;
                }
            };

            return obj;
        };

        return service;
    }
]);

/**
 * ReelsArea controller.
 * @module ReelsArea
 * @name ReelsAreaController
 * @type {Controller}
 */
ReelsArea.controller('ReelsArea.controller', [
    '$scope', '$state', '$stateParams', '$modal', 'BasicModals', 'AccountService', 'AlertsService', 'ReelsFactory', 'PlayManager', 'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'LeaguesFactory',
    function controller($scope, $state, $stateParams, $modal, modals, account, alerts, reels, playManager, gamesFactory, playsFactory, teamsFactory, leaguesFactory) {

        // Get the reel
        var reelId = Number($stateParams.id);
        $scope.reel = reels.get(reelId);
        console.log('reel', $scope.reel);
        console.log('reel plays', $scope.reel.plays);
        $scope.videoTitle = 'reelsPlayer';
        $scope.editMode = false;
        var editAllowed = true;
        $scope.reelCreatedDate = (typeof $scope.reelCreatedDate === 'string') ? new Date($scope.reel.createdAt) : $scope.reel.createdAt;
        $scope.reelUpdatedDate = (typeof $scope.reelUpdatedDate === 'string') ? new Date($scope.reel.updatedAt) : $scope.reel.updatedAt;

        $scope.plays = playsFactory.getList();

        $scope.toggleEditMode = function() {
            //This method is for entering edit mode, or cancelling,
            //NOT for exiting from commiting changes
            console.log('toggleEditMode');
            if (!editAllowed) return;

            $scope.editMode = !$scope.editMode;

            if ($scope.editMode) {
                console.log('enter edit mode');
                //entering edit mode, cache plays array
                if ($scope.reel && $scope.reel.plays && angular.isArray($scope.reel.plays)) {
                    $scope.toggleEditMode.playsCache = angular.copy($scope.reel.plays);
                }
            } else {
                //cancelling edit mode

                if ($scope.toggleEditMode.playsCache) {
                    //get rid of dirty plays array
                    console.log('delete reel plays');
                    delete $scope.reel.plays;

                    //in with clean
                    $scope.reel.plays = $scope.toggleEditMode.playsCache;
                    console.log('plays', $scope.reel.plays);
                }
            }
            console.log('$scope.toggleEditMode.playsCache', $scope.toggleEditMode.playsCache);
        };

        $scope.getPlay = function(playId) {
            return playsFactory.get(playId);
        };

        $scope.getLeague = function(playId) {
            return leaguesFactory.get($scope.getHomeTeam(playId).leagueId);
        };

        $scope.getGame = function(playId) {
            return gamesFactory.get(playsFactory.get(playId).gameId);
        };

        $scope.getHomeTeam = function(playId) {

            if (playId) {
                var gameId = playsFactory.get(playId).gameId;
                var teamId = gamesFactory.get(gameId).teamId;

                return teamsFactory.get(teamId);
            }
        };

        $scope.getOpposingTeam = function(playId) {

            if (playId) {
                var gameId = playsFactory.get(playId).gameId;
                var teamId = gamesFactory.get(gameId).opposingTeamId;

                return teamsFactory.get(teamId);
            }
        };

        $scope.getDatePlayed = function(playId) {

            if (playId) {
                var gameId = playsFactory.get(playId).gameId;

                return gamesFactory.get(gameId).datePlayed;
            }
        };

        $scope.$on('delete-reel-play', function(index) {
            if ($scope.editMode && $scope.reel && $scope.reel.plays && angular.isArray($scope.reel.plays)) {
                $scope.reel.plays.splice(index, 1);
            }
        });

        $scope.saveReels = function() {
            //delete cached plays
            delete $scope.toggleEditMode.playsCache;

            $scope.editMode = false;
            editAllowed = false;

            $scope.reel.save().then(function() {
                editAllowed = true;
            });
        };

        $scope.deleteReel = function() {
            var deleteReelModal = modals.openForConfirm({
                title: 'Delete Reel',
                bodyText: 'Are you sure you want to delete this reel?',
                buttonText: 'Yes'
            });

            deleteReelModal.result.then(function() {
                $scope.reel.remove();
                account.gotoUsersHomeState();
            });
        };
    }
]);

