/* Fetch angular from the browser scope */
const angular = window.angular;

ReelController.$inject = [
    'DEVICE',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$modal',
    'BasicModals',
    'AuthenticationService',
    'AccountService',
    'AlertsService',
    'ReelsFactory',
    'PlayManager',
    'GamesFactory',
    'PlaysFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'PlaysManager',
    'SessionService',
    'ROLES',
    'VIEWPORTS',
    'TELESTRATION_PERMISSIONS',
    'TelestrationsVideoPlayerBroker',
    'PlaylistEventEmitter',
    'EVENT'
];

/**
 * Reel controller.
 * @module Reel
 * @name ReelController
 * @type {Controller}
 */
function ReelController(
    DEVICE,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $modal,
    modals,
    auth,
    account,
    alerts,
    reelsFactory,
    playManager,
    gamesFactory,
    playsFactory,
    teamsFactory,
    leaguesFactory,
    playsManager,
    session,
    ROLES,
    VIEWPORTS,
    TELESTRATION_PERMISSIONS,
    TelestrationsVideoPlayerBroker,
    playlistEventEmitter,
    EVENT
) {

    const telestrationsVideoPlayerBroker = new TelestrationsVideoPlayerBroker();

    let reelId = Number($stateParams.id);
    let reel = reelsFactory.get(reelId);
    let currentUser = session.getCurrentUser();
    let isUploader = reel.isUploader(currentUser.id);
    let isTeamUploadersTeam = reel.isTeamUploadersTeam(currentUser.currentRole.teamId);
    let isCoach = currentUser.is(ROLES.COACH);
    let plays = reel.plays.map(mapPlays);
    let play = plays[0];
    let game = gamesFactory.get(plays[0].gameId);
    let isTelestrationsSharedWithCurrentUser = reel.isTelestrationsSharedWithUser(currentUser);
    let isTelestrationsSharedPublicly = reel.isTelestrationsSharedPublicly();
    let team = teamsFactory.get(game.teamId);
    let league = leaguesFactory.get(team.leagueId);
    let isMobile = $rootScope.DEVICE === DEVICE.MOBILE;

    $scope.VIEWPORTS = VIEWPORTS;
    $scope.reel = reel;
    $scope.auth = auth;
    $scope.expandAll = false;
    $scope.isReelsPlay = true;
    $scope.plays = plays;
    $scope.playManager = playManager;
    $scope.sources = plays[0].getVideoSources();
    $scope.currentPlayId = play.id;
    $scope.game = game;
    $scope.league = league;

    playManager.current = play;


    /* TODO: game.getPosterImage() */
    $scope.posterImage = {
        url: game.video.thumbnail
    };

    /* TODO: reel.getPlays() */
    function mapPlays (playId, index) {

        let play = playsFactory.get(playId);

        /* Record the position of the play in the reel. */
        play.index = index;

        /* Assume all plays in a reel have visible events, this should hold true
         * because they are all added from visible plays on a breakdown. */
        play.hasVisibleEvents = true;

        return play;
    }

    // Store the reel order on the play
    $scope.$watchCollection('plays', function sortPlays(newVals) {

        $scope.plays.forEach(function indexPlays(play, index) {

            play.index = index;
        });
    });

    /* Telestrations associated with plays */

    $scope.plays.forEach((play) => {
        play.hasTelestrations = reel.telestrations.some((telestration) => play.id === telestration.playId && telestration.hasGlyphs());
    });

    /* TODO: MOVE PLAY/GAME RESTRICTIONS TO A SERVICE */
    // Editing config

    $scope.editFlag = false;
    let editAllowed = true;

    const REELS_PERMISSIONS = {
        EDITABLE: 0,
        VIEWABLE: 1
    };

    // DEFAULT RESTRICTION
    let reelsPermissions = REELS_PERMISSIONS.VIEWABLE;

    if (isTeamUploadersTeam && isCoach || isUploader) {

        reelsPermissions = REELS_PERMISSIONS.EDITABLE;
    }

    $scope.canUserEdit = reelsPermissions === REELS_PERMISSIONS.DELETABLE || reelsPermissions === REELS_PERMISSIONS.EDITABLE;

    // telestrations

    $scope.telestrationsEntity = reel.telestrations;

    // uploader could be a coach or an athlete (they have permissions to edit by default)
    if (isMobile) {
        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.NO_ACCESS;
    }
    else if (isUploader) {

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

    // set initial cuepoints
    if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

        $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(play.id, play.startTime);
    }


    /* TODO: Edit "mode"? */
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

        } else if ($scope.toggleEditMode.playsCache) {

            //get rid of dirty plays array
            delete $scope.plays;

            //in with clean
            $scope.plays = $scope.toggleEditMode.playsCache;
        }
    };

    /* TODO: What is this doing? */
    $scope.$on('delete-reel-play', function postReelPlayDeleteSetup($event, index) {
        if ($scope.editFlag && $scope.plays && angular.isArray($scope.plays)) {
            $scope.plays.splice(index, 1);
        }
    });

    /* TODO: Why not just reel.save()? */
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

    if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

        playlistEventEmitter.on(EVENT.PLAYLIST.PLAY.CURRENT, onPlaylistWatch);
    }

    if ($scope.telestrationsPermissions === TELESTRATION_PERMISSIONS.EDIT) {

        $scope.$on('telestrations:updated', function handleTelestrationsUpdated(event) {

            if (playManager.current) {

                $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(playManager.current.id, playManager.current.startTime);
            }

        });

        $scope.$on('telestrations:save', function handleTelestrationSave(event, callbackFn) {

            callbackFn = callbackFn || angular.noop;

            // Save Game
            $scope.reel.save().then(function onSaved() {
                callbackFn();
            });
        });
    }

    function onPlaylistWatch(play) {

        if (play && play.id) {

            $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(play.id, play.startTime);
            $scope.currentPlayId = play.id;
        }
    }

    $scope.$watch('plays', function playsWatch(newVals, oldVals) {

        $scope.filteredPlaysIds = newVals;
    });

    $scope.$on('$destroy', function onDestroy() {

        telestrationsVideoPlayerBroker.cleanup();
        playlistEventEmitter.removeListener(EVENT.PLAYLIST.PLAY.CURRENT, onPlaylistWatch);
    });
}

export default ReelController;
