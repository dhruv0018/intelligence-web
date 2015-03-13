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
                '$state', '$stateParams', 'AccountService', 'ReelsFactory', 'Reels.Data',
                function($state, $stateParams, account, reels, data) {

                    var reelId = Number($stateParams.id);
                    var reel = reels.get(reelId);

                    if (reel.isDeleted) {
                        account.gotoUsersHomeState();
                    }
                }
            ],
            onExit: [
                'PlayManager',
                function(playManager) {
                    playManager.clear();
                }
            ]
        };

        $stateProvider.state(shortReelsState);
        $stateProvider.state(reelsState);
    }
]);

ReelsArea.service('Reels.Data.Dependencies', [
    'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'ReelsFactory', 'LeaguesFactory', 'TagsetsFactory', 'PlayersFactory', 'UsersFactory',
    function dataService(games, plays, teams, reels, leagues, tagsets, players, users) {

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
    '$rootScope', '$scope', '$state', '$stateParams', '$modal', 'BasicModals', 'AuthenticationService', 'AccountService', 'AlertsService', 'ReelsFactory', 'PlayManager', 'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'LeaguesFactory', 'PlaysManager', 'SessionService', 'ROLES', 'VIEWPORTS', 'UsersFactory', 'TELESTRATION_PERMISSIONS',
    function controller($rootScope, $scope, $state, $stateParams, $modal, modals, auth, account, alerts, reels, playManager, gamesFactory, playsFactory, teamsFactory, leaguesFactory, playsManager, session, ROLES, VIEWPORTS, users, TELESTRATION_PERMISSIONS) {

        /* Variables */

        var reelId = Number($stateParams.id);
        var reel = reels.get(reelId);
        var currentUser = session.getCurrentUser();
        var isUploader = reel.isUploader(currentUser.id);
        var isTeamUploadersTeam = reel.isTeamUploadersTeam(currentUser.currentRole.teamId);
        var isCoach = currentUser.is(ROLES.COACH);
        var editAllowed = true;
        var isTelestrationsSharedWithCurrentUser = reel.isTelestrationsSharedWithUser(currentUser);
        var isTelestrationsSharedPublicly = reel.isTelestrationsSharedPublicly();

        var REELS_PERMISSIONS = {
            DELETABLE: 'DELETABLE',
            EDITABLE: 'EDITABLE',
            VIEWABLE: 'VIEWABLE'
        };
        var reelsPermissions = REELS_PERMISSIONS.VIEWABLE; // DEFAULT PERMISSION

        var plays = reel.plays.map(function getPlays(playId, index) {

            var play = playsFactory.get(playId);
            play.index = index;

            return play;
        });
        var play = plays[0];
        var playRelatedGame = gamesFactory.get(play.gameId);


        /* Initialization */

        // Refresh the playsManager

        playsManager.reset(plays);


        /* Scope */

        // services

        $scope.auth = auth;
        $scope.playManager = playManager;
        $scope.VIEWPORTS = VIEWPORTS;

        // film header

        $scope.reel = reel;

        // playlist - 'hidden' (dependended upon by directive but not via isolate scope)

        $scope.expandAll = false;
        $scope.isReelsPlay = true;
        $scope.plays = plays;
        $scope.sortOrder = reel.plays;

        // reel editing and permissions

        $scope.editFlag = false;

        if (isUploader) {

            reelsPermissions = REELS_PERMISSIONS.DELETABLE;

        } else if (isTeamUploadersTeam && isCoach) {

             reelsPermissions = REELS_PERMISSIONS.EDITABLE;
        }

        $scope.canUserDelete = reelsPermissions === REELS_PERMISSIONS.DELETABLE;
        $scope.canUserEdit = reelsPermissions === REELS_PERMISSIONS.DELETABLE || reelsPermissions === REELS_PERMISSIONS.EDITABLE;

        // telestrations

        $scope.telestrationsEntity = reel.telestrations;

        // uploader could be a coach or an athlete (they have permissions to edit by default)
        if (isUploader) {

            $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.EDIT;

        }
        // Coaches on the same team as the uploader can edit
        else if (isTeamUploadersTeam && isCoach) {

            $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.EDIT;

        } else if (isTelestrationsSharedWithCurrentUser || isTelestrationsSharedPublicly) {

            $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.VIEW;

        } else {

            $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.NO_ACCESS;
        }

        // video player

        $scope.cuePoints = [];
        $scope.sources = play.getVideoSources();
        $scope.currentPlayId = play.id;
        $scope.posterImage = {
            url: playRelatedGame.video.thumbnail
        };

        // functions

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

        $scope.saveReels = function saveReels() {
            //delete cached plays
            delete $scope.toggleEditMode.playsCache;

            $scope.editFlag = false;
            editAllowed = false;

            // Update reel locally
            var reelPlayIds = $scope.plays.map(function getPlayId(play) {
                return play.id;
            });
            reel.plays = reelPlayIds;

            reel.save().then(function postReelSaveSetup() {
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
                reel.remove();
                account.gotoUsersHomeState();
            });
        };


        /* Listeners and Watches */

        $scope.$watchCollection('playManager.current', function(currentPlay) {

            if (currentPlay && currentPlay.id) {

                $scope.currentPlayId = currentPlay.id;

                if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

                    $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(currentPlay.id);
                }
                // TODO: add back event cuepoint an concat with play cuepoints
                // var eventCuePoints = play.getEventCuePoints();
                // $scope.cuePoints = $scope.cuepoints.concat(eventCuePoints);
            }
        });

        // Update the play order if the sortOrder changes based on play Ids
        $scope.$watchCollection('sortOrder', function sortPlays(newVals) {

            $scope.plays.sort(function sortCallback(itemA, itemB) {return (newVals.indexOf(itemA.id) < newVals.indexOf(itemB.id) ? -1 : 1);});

            $scope.plays.forEach(function indexPlays(play, index) {
                play.index = index;
            });
        });

        $scope.$on('delete-reel-play', function postReelPlayDeleteSetup($event, index) {

            if ($scope.editFlag && $scope.plays && angular.isArray($scope.plays)) {

                $scope.plays.splice(index, 1);
                $scope.sortOrder.splice(index, 1);
            }
        });

        if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

            $scope.$on('telestrations:updated', function handleTelestrationsUpdated(event) {

                $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(playManager.getCurrentPlayId());

            });

            $scope.$on('telestrations:save', function handleTelestrationSave(event, callbackFn) {

                callbackFn = callbackFn || angular.noop;

                // Save Game
                reel.save().then(function onSaved() {
                    callbackFn();
                });
            });
        }

    }
]);

