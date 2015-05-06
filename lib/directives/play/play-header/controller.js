PlayHeaderController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'SessionService',
    'EventManager',
    'VideoPlayer',
    'PlayManager',
    'ROLES'
];

function PlayHeaderController(
    $scope,
    $state,
    $stateParams,
    session,
    eventManager,
    videoPlayer,
    playManager,
    ROLES
    ) {

    $scope.currentUser = session.getCurrentUser();
    $scope.ROLES = ROLES;

    /* Loads play for video */
    $scope.loadPlay = function() {
        let play = $scope.play;
        let event = eventManager.current && eventManager.current.time ?
            eventManager.current : play.events[0];

        /* If the video player is ready. */
        if (videoPlayer.isReady) {

            /* Use the current event time for the video time. */
            let time = event.time;

            /* If the play has been clipped. */
            if (play.clip) {

                /* Adjust the video time to start time of the play. */
                time -= play.startTime;

                /* Get the video sources for the play. */
                let sources = play.getVideoSources();

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

    $scope.loadMobileClipPlay = function() {
        if ($state.current.name === 'Clips') {
            $scope.loadPlay();
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
            $scope.loadPlay();
        } else {
            $scope.loadMobileClipPlay();
        }
    };

    //when you click the play header but not the button to initiate the clip
    $scope.expandPlay = function() {
        let windowWidth = window.innerWidth;
        let breakpoint = 1024; //pixels the behavior changes at

        if (windowWidth > breakpoint) { //desktop opens the play
            $scope.showPlayBody = !$scope.showPlayBody;
        } else {

            $scope.loadMobileClipPlay(); //mobile goes to the clip
        }
    };

    // Selects play to be used in batch operations
    $scope.selectPlay = function(play) {
        play.isSelected = !play.isSelected;
    };

    $scope.deleteReelPlay = function(index) {
        $scope.$emit('delete-reel-play', index);
    };

}

export default PlayHeaderController;
