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

        var shortReelsState = {
            name: 'ShortReels',
            url: '/r/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function($state, $stateParams) {
                    var reelId = parseInt($stateParams.id, 36);
                    $state.go('ReelsArea', {id: reelId});
                }
            ]
        };

        var reelsState = {
            name: 'ReelsArea',
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
        };

        $stateProvider.state(shortReelsState);
        $stateProvider.state(reelsState);
    }
]);

ReelsArea.service('Reels.Data.Dependencies', [
    'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'ReelsFactory', 'LeaguesFactory', 'TagsetsFactory', 'PlayersFactory',
    function dataService(games, plays, teams, reels, leagues, tagsets, players) {

        var service = function(stateParams) {

            var obj = {

                load: function() {

                    var reelId = Number(stateParams.id);

                    var data = {
                        reel: reels.load(reelId),
                        games: games.load({reelId: reelId}),
                        teams: teams.load({reelId: reelId}),
                        plays: plays.load({reelId: reelId}),
                        players: players.load({reelId: reelId}),
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
    '$rootScope', '$scope', '$state', '$stateParams', '$modal', 'BasicModals', 'AuthenticationService', 'AccountService', 'AlertsService', 'ReelsFactory', 'PlayManager', 'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'LeaguesFactory', 'PlaysManager', 'SessionService', 'ROLES', 'VIEWPORTS',
    function controller($rootScope, $scope, $state, $stateParams, $modal, modals, auth, account, alerts, reels, playManager, gamesFactory, playsFactory, teamsFactory, leaguesFactory, playsManager, session, ROLES, VIEWPORTS) {

        $scope.auth = auth;

        $scope.isReelsPlay = true;

        playManager.videoTitle = 'reelsPlayer';

        // Get reel
        var reelId = Number($stateParams.id);
        $scope.reel = reels.get(reelId);

        // Setup playlist
        var plays = $scope.reel.plays.map(function getPlays(playId) {
            return playsFactory.get(playId);
        });
        $scope.plays = plays;
        $scope.sortOrder = $scope.reel.plays;

        // Update the play order if the sortOrder changes based on play Ids
        $scope.$watchCollection('sortOrder', function sortPlays(newVals) {
            $scope.plays.sort(function sortCallback(itemA, itemB) {return (newVals.indexOf(itemA.id) < newVals.indexOf(itemB.id) ? -1 : 1);});
        });

        $scope.playManager = playManager;
        // Refresh the playsManager
        playsManager.reset($scope.plays);

        $scope.expandAll = false;

        // Editing config

        $scope.editFlag = false;
        var editAllowed = true;

        var editModeRestrictions = {
            DELETABLE: 'DELETABLE',
            EDITABLE: 'EDITABLE',
            VIEWABLE: 'VIEWABLE'
        };

        /* TODO: MOVE PLAY/GAME RESTRICTIONS TO A SERVICE */
        // DEFAULT RESTRICTION
        $scope.restrictionLevel = editModeRestrictions.VIEWABLE;

        var isCoach = session.currentUser.is(ROLES.COACH);
        var isACoachOfThisTeam = isCoach && session.currentUser.currentRole.teamId === $scope.reel.uploaderTeamId;
        var isOwner = session.currentUser.id === $scope.reel.uploaderUserId;

        if (isACoachOfThisTeam) $scope.restrictionLevel = editModeRestrictions.EDITABLE;
        if (isOwner) $scope.restrictionLevel = editModeRestrictions.DELETABLE;

        $scope.canUserDelete = $scope.restrictionLevel === editModeRestrictions.DELETABLE;
        $scope.canUserEdit = $scope.restrictionLevel === editModeRestrictions.DELETABLE || $scope.restrictionLevel === editModeRestrictions.EDITABLE;

        $scope.VIEWPORTS = VIEWPORTS;

        $scope.toggleEditMode = function toggleEditMode() {
            //This method is for entering edit mode, or cancelling,
            //NOT for exiting from commiting changes
            if (!editAllowed) return;

            $scope.editFlag = !$scope.editFlag;

            if ($scope.editFlag) {
                //entering edit mode, cache plays array
                if ($scope.plays && angular.isArray($scope.plays)) {
                    $scope.toggleEditMode.playsCache = angular.copy($scope.plays);
                }
            } else {
                //cancelling edit mode

                if ($scope.toggleEditMode.playsCache) {
                    //get rid of dirty plays array
                    delete $scope.plays;

                    //in with clean
                    $scope.plays = $scope.toggleEditMode.playsCache;
                }
            }
        };

        $scope.$on('delete-reel-play', function postReelPlayDeleteSetup($event, index) {
            if ($scope.editFlag && $scope.plays && angular.isArray($scope.plays)) {
                $scope.plays.splice(index, 1);
                $scope.sortOrder.splice(index, 1);
            }
        });

        $scope.saveReels = function saveReels() {
            //delete cached plays
            delete $scope.toggleEditMode.playsCache;

            $scope.editFlag = false;
            editAllowed = false;

            // Update reel locally
            var reelPlayIds = $scope.plays.map(function getPlayId(play) {
                return play.id;
            });
            $scope.reel.plays = reelPlayIds;

            $scope.reel.save().then(function postReelSaveSetup() {
                editAllowed = true;

                // Refresh the playManager
                playsManager.reset($scope.plays);
            });
        };

        $scope.deleteReel = function deleteReel() {
            var deleteReelModal = modals.openForConfirm({
                title: 'Delete Reel',
                bodyText: 'Are you sure you want to delete this reel?',
                buttonText: 'Yes'
            });

            deleteReelModal.result.then(function postReelModalResult() {
                $scope.reel.remove();
                account.gotoUsersHomeState();
            });
        };
    }
]);

