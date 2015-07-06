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
    videoPlayer,
    VideoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS
)   {
        $scope.athlete = users.get($stateParams.id);
        $scope.profileReels = reels.getList($scope.athlete.profile.reelIds);
        $scope.featuredReel = $scope.profileReels[0];
        $scope.config = config;
        $scope.options = {scope: $scope};

        // Check if user is on their own profile
        $scope.isCurrentUser = false;
        if ($scope.athlete.id === session.getCurrentUserId()) $scope.isCurrentUser = true;

        if ($scope.featuredReel) {

            // Populate the array with play objects from playIds
            let playsArray = $scope.featuredReel.plays.map(function(playId) {
                return plays.get(playId);
            });

            /* Load the plays in the plays manager
             * TODO: accomplish this without playsManager
             */
            playsManager.reset(playsArray);

            // Start with first play
            $scope.currentPlay = playsArray[0];
            $scope.sources = $scope.currentPlay.getVideoSources();
            $scope.clipTotal = $scope.featuredReel.plays.length;
            $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;

            $scope.$watch('clipIndex', function updatePlayInfo() {
                // When clip index is changed, adjust adjacent plays accordingly
                $scope.previousPlay = playsManager.getPreviousPlay($scope.currentPlay);
                $scope.nextPlay = playsManager.getNextPlay($scope.currentPlay);
            });
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
}

Highlights.controller('Athlete.Profile.Highlights.controller', HighlightsController);

export default HighlightsController;
