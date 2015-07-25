/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Profile.Highlights page module.
 * @module Profile.Highlights
 */
const Highlights = angular.module('Athlete.Profile.Highlights');

/**
 * Profile.Highlights dependencies
 */
HighlightsController.$inject = [
    '$scope',
    '$stateParams',
    'config',
    'ReelsFactory',
    'UsersFactory',
    'PlaysFactory',
    'PlaysManager',
    'PlayManager',
    'SessionService',
    'ManageProfileReels.Modal',
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS'
];

/**
 * Profile.Highlights controller.
 * @module Profile.Highlights
 * @name Profile.Highlights.controller
 * @type {controller}
 */
function HighlightsController (
    $scope,
    $stateParams,
    config,
    reels,
    users,
    plays,
    playsManager,
    playManager,
    session,
    manageProfileReelsModal,
    videoPlayer,
    VideoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS
)   {
        $scope.athlete = users.get($stateParams.id);
        $scope.profileReels = reels.getSortedProfileReels($scope.athlete);
        $scope.featuredReel = $scope.profileReels[0];
        $scope.config = config;
        $scope.options = {scope: $scope};
        let playsArray = [];

        // Check if user is on their own profile
        $scope.isCurrentUser = $scope.athlete.id === session.getCurrentUserId();

        if ($scope.featuredReel) {

            // Populate the array with play objects from playIds
            playsArray = $scope.featuredReel.plays.map(function(playId) {
                return plays.get(playId);
            });

            resetPlays(playsArray);

            $scope.$watch('clipIndex', updatePlayInfo);
        }

        // When clip finishes playing, go to next play if continuous play is on
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);

        function onCompleteVideo() {

            /* If continuous play is on. */
            if (playManager.playAllPlays) {
                $scope.goToPlay($scope.nextPlay);

                VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, function playVideo() {
                    videoPlayer.play();
                    VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, playVideo);
                });
            }
        }

        function resetPlays(playsArray) {
            /* Load the plays in the plays manager
             * TODO: accomplish this without playsManager
             */
            playsManager.reset(playsArray);

            // Start with first play
            $scope.currentPlay = playsArray[0];
            $scope.sources = $scope.currentPlay.getVideoSources();
            $scope.clipTotal = $scope.featuredReel.plays.length;
            $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;
        }

        function updatePlayInfo() {
            // When clip index is changed, adjust adjacent plays accordingly
            $scope.previousPlay = playsManager.getPreviousPlay($scope.currentPlay);
            $scope.nextPlay = playsManager.getNextPlay($scope.currentPlay);
        }

        $scope.manageReels = function() {
            let modal = manageProfileReelsModal.open({
                options: $scope.options
            });

            modal.result.then( () => {
                $scope.athlete = users.get($stateParams.id);
                $scope.profileReels = reels.getSortedProfileReels($scope.athlete);
                $scope.featuredReel = $scope.profileReels[0];
                if ($scope.featuredReel) {
                    plays.query({reelId: $scope.featuredReel.id}).then(featuredPlays => {
                        playsArray = featuredPlays;
                        resetPlays(playsArray);
                        updatePlayInfo();
                    });
                }
            });
        };
}

Highlights.controller('Athlete.Profile.Highlights.controller', HighlightsController);

export default HighlightsController;
