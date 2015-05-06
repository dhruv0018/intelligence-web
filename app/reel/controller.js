/* Fetch angular from the browser scope */
const angular = window.angular;

ReelController.$inject = [
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
    'VIEWPORTS'
];

/**
 * Reel controller.
 * @module Reel
 * @name ReelController
 * @type {Controller}
 */
function ReelController(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $modal,
    modals,
    auth,
    account,
    alerts,
    reels,
    playManager,
    gamesFactory,
    playsFactory,
    teamsFactory,
    leaguesFactory,
    playsManager,
    session,
    ROLES,
    VIEWPORTS
) {

    let reelId = Number($stateParams.id);
    let reel = reels.get(reelId);
    let plays = reel.plays.map(mapPlays);
    let game = gamesFactory.get(plays[0].gameId);

    $scope.VIEWPORTS = VIEWPORTS;
    $scope.reel = reel;
    $scope.auth = auth;
    $scope.expandAll = false;
    $scope.isReelsPlay = true;
    $scope.plays = plays;
    $scope.playManager = playManager;
    $scope.sources = plays[0].getVideoSources();

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

    /* TODO: Rename sortOrder? */
    // Update the play order if the sortOrder changes based on play Ids
    $scope.sortOrder = $scope.plays;
    // $scope.sortOrder = $scope.reel.plays;

    $scope.$watchCollection('sortOrder', function sortPlays(newVals) {

        $scope.plays.forEach(function indexPlays(play, index) {

            play.index = index;
        });
    });


    /* TODO: MOVE PLAY/GAME RESTRICTIONS TO A SERVICE */
    // Editing config

    $scope.editFlag = false;
    var editAllowed = true;

    var editModeRestrictions = {
        DELETABLE: 'DELETABLE',
        EDITABLE: 'EDITABLE',
        VIEWABLE: 'VIEWABLE'
    };

    // DEFAULT RESTRICTION
    $scope.restrictionLevel = editModeRestrictions.VIEWABLE;

    var isCoach = session.currentUser.is(ROLES.COACH);
    var isACoachOfThisTeam = isCoach && session.currentUser.currentRole.teamId === $scope.reel.uploaderTeamId;
    var isOwner = session.currentUser.id === $scope.reel.uploaderUserId;

    if (isACoachOfThisTeam) $scope.restrictionLevel = editModeRestrictions.EDITABLE;
    if (isOwner) $scope.restrictionLevel = editModeRestrictions.DELETABLE;

    $scope.canUserDelete = $scope.restrictionLevel === editModeRestrictions.DELETABLE;
    $scope.canUserEdit = $scope.restrictionLevel === editModeRestrictions.DELETABLE || $scope.restrictionLevel === editModeRestrictions.EDITABLE;

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
            $scope.sortOrder.splice(index, 1);
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

    $scope.$watch('plays', function playsWatch(newVals, oldVals) {

        $scope.filteredPlaysIds = newVals;
    });
}

export default ReelController;
