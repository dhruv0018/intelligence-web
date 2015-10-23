/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* ClipsNavigationController dependencies
*/
ClipsNavigationController.$inject = [
    '$scope',
    'PlayManager',
    'PlaysManager',
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS'
];

/**
 * ClipsNavigationController controller.
 * @module ClipsNavigationController
 * @name ClipsNavigationController.controller
 * @type {controller}
 */
function ClipsNavigationController (
    $scope,
    playManager,
    playsManager,
    videoPlayer,
    VideoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS
) {

    $scope.$watch('plays', function setPlays() {
        let clipTotal = $scope.plays.length;

        $scope.plays.forEach(function(play, index) {
            // TODO: get summary script without html tags more elegantly
            index++;
            let summaryScript = play.summaryScript;
            let summary = summaryScript.slice(summaryScript.indexOf('>')+1, summaryScript.indexOf('</span>'));
            play.name = 'Clip ' + index + '/' + clipTotal + ' - ' + summary;
        });

        /* Load the plays in the plays manager
         * TODO: accomplish this without playsManager
         */
        playsManager.reset($scope.plays);

        $scope.currentPlay = $scope.plays[0];
        $scope.goToPlay($scope.currentPlay);
    });

    $scope.goToPlay = function goToPlay(play) {

        // Find out if video is playing
        let isPlaying = false;
        if (videoPlayer.currentState === 'play') isPlaying = true;

        $scope.currentPlay = play;
        $scope.previousPlay = playsManager.getPreviousPlay($scope.currentPlay);
        $scope.nextPlay = playsManager.getNextPlay($scope.currentPlay);

        // Set the current play.
        playManager.current = $scope.currentPlay;

        // Replace video sources
        $scope.video = $scope.currentPlay.clip;
        videoPlayer.setVideo($scope.video);

        // Play video if it was playing before play change
        if(isPlaying) {
            VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, playVideo);
        }

        // Change clip index to reflect current play
        $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;
    };

    // When clip finishes playing, go to next play if continuous play is on
    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);

    function onCompleteVideo() {
        /* Always play continuously */
        $scope.goToPlay($scope.nextPlay);

        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, playVideo);
    }

    function playVideo() {
        videoPlayer.play();
        VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, playVideo);
    }
}

export default ClipsNavigationController;
