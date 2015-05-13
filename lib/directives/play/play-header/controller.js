PlayHeaderController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'EventManager',
    'VideoPlayer',
    'PlayManager'
];

function PlayHeaderController($scope, $state, $stateParams, eventManager, videoPlayer, playManager) {
    /**
     * Selects this play.
     */
    $scope.selectPlay = function() {
        var play = $scope.play;
        var event = eventManager.current && eventManager.current.time ?
            eventManager.current : play.events[0];

        /* If the video player is ready. */
        if (videoPlayer.isReady) {

            /* Use the current event time for the video time. */
            var time = event.time;

            /* If the play has been clipped. */
            if (play.clip) {

                /* Adjust the video time to start time of the play. */
                time -= play.startTime;

                /* Get the video sources for the play. */
                var sources = play.getVideoSources();

                /* If the play has changed. */
                if (playManager.current !== play) {

                    /* Change the video player sources. */
                    videoPlayer.changeSource(sources);
                }
            }

            /* Seek the video player to the appropriate time. */
            videoPlayer.seekTime(time);
        }

        /* Set the current play to match the selected play. */
        playManager.current = play;
    };

    $scope.selectMobileClipPlay = function() {
        $scope.selectPlay();
        if ($state.current.name === 'Clips') {
            videoPlayer.play();
        } else if ($state.current.name === 'Reel') {
            $state.go('Clips', {id: $scope.play.id, reel: $stateParams.id, game: null});
        } else if ($state.current.name.indexOf('Games') > -1) { // Checks for all states with 'Games' in state name string
            $state.go('Clips', {id: $scope.play.id, game: $stateParams.id, reel: null});
        } else {
            $state.go('Clips', {id: $scope.play.id});
        }
    };

    //for screens larger than 1024 - play the video clip associated with the chosen play
    //for smaller screens, reroute to the clip area
    $scope.viewAssociatedPlayContent = function() {
        let windowWidth = window.innerWidth;
        let breakpoint = 1024; //pixels the behavior changes at

        if (windowWidth > breakpoint) { //desktop
            $scope.selectPlay();
        } else {
            $scope.selectMobileClipPlay();
        }
    };

    //when you click the play header but not the button to initiate the clip
    $scope.openPlay = function() {
        let windowWidth = window.innerWidth;
        let breakpoint = 1024; //pixels the behavior changes at

        if (windowWidth > breakpoint) { //desktop opens the play
            $scope.showPlayBody = !$scope.showPlayBody;
        } else {

            $scope.selectMobileClipPlay(); //mobile goes to the clip
        }
    };

    $scope.deleteReelPlay = function(index) {
        $scope.$emit('delete-reel-play', index);
    };

}

export default PlayHeaderController;
