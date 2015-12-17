SelfEditedPlayController.$inject = [
    '$scope',
    'SelfEditedPlayControlsModeNotifier',
    'SelfEditedPlayStateNotifier',
    'VideoPlayer'
];

function SelfEditedPlayController (
    $scope,
    selfEditedPlayControlsModeNotifier,
    selfEditedPlayStateNotifier,
    videoPlayer
) {

    $scope.showStateActions = true;
    $scope.showDeleteConfirmationActions = false;

    $scope.onPlayButtonClick = function() {
        watchPlay($scope.play, $scope.video);
    };

    $scope.onEditButtonClick = function() {
        // user indicated that they want to edit the play
        // notify the play controls mode notifier
        selfEditedPlayControlsModeNotifier.notifyEnableEditMode($scope.play);
    };

    $scope.onDeleteButtonClick = function() {

        deletePlay($scope.play);
    };

    /*
     * watchPlay The video play is more of a time fragment out of a
     * single video source that comes from the game.
     * Thus, watchPlay initializes the video player
     * the proper video (in case it hasn't been set already),
     * sets the video start and end time to that of the play,
     * and plays the video player.
     */
    function watchPlay(play, video) {

        // set the video source and time fragment
        videoPlayer.setVideoFragment(video, play.startTime, play.endTime)
            // when the video player is ready, watch the play
            .then(function canWatchPlay() {
                videoPlayer.play();
            });
    }

    function deletePlay(play) {

        play.delete()
            .then(function onDeleteComplete() {
                // notify the play state notifier that the play was deleted
                selfEditedPlayStateNotifier.notifyDidDelete(play);
                selfEditedPlayControlsModeNotifier.notifyDisableEditMode(play);
            });
    }
}

export default SelfEditedPlayController;
