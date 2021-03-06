PlayHeaderController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    'PlaylistEventEmitter',
    'EVENT',
    'PLAYLIST_EVENTS',
    'VIEWPORTS'
];

function PlayHeaderController (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    playlistEventEmitter,
    EVENT,
    PLAYLIST_EVENTS,
    VIEWPORTS
) {

    /* Scope properties. */
    $scope.VIEWPORTS = VIEWPORTS;
    $scope.openPlay = openPlay;
    $scope.watchPlay = watchPlay;

    /**
     * Opens a play.
     * The play body is toggled to show or hide the events inside the play.
     *
     * FIXME: This is temporary for the current mobile implementation,
     * right now when "opening" a play on mobile to goes to the 'Clips' state,
     * this is supposed to be on the same page in the future.
     * @param play - the play to open.
     */
    function openPlay (play) {

        /* Toggle play body. */
        $scope.showPlayBody = !$scope.showPlayBody;

        /* FIXME: Temporary condition for mobile implementation! */
        if ($rootScope.viewport === VIEWPORTS.MOBILE) {
            if ($state.current.name === 'Reel') {
                $state.go('Clips', {id: play.id, reel: $stateParams.id, game: null});
            } else if ($state.current.name.indexOf('Games') > -1) { // Checks for all states with 'Games' in state name string
                $state.go('Clips', {id: play.id, game: $stateParams.id, reel: null});
            } else {
                $state.go('Clips', {id: play.id});
            }
        }
    }

    /**
     * Watch a play.
     * Watches the play in the video player.
     * @param play - the play to watch.
     */
    function watchPlay (play) {

        /* Emit a watch play event through the playlist event emitter. */
        playlistEventEmitter.emit(EVENT.PLAYLIST.PLAY.WATCH, play);
    }

    /* FIXME: What does this do? */
    $scope.deleteReelPlay = function(index) {
        $scope.$emit('delete-reel-play', index);
    };

    // Toggles whether a play is selected to be used in batch operations
    $scope.togglePlaySelection = function(event, play) {
        event.stopPropagation();

        play.isSelected = !play.isSelected;

        // Emit toggled play event
        playlistEventEmitter.emit(PLAYLIST_EVENTS.SELECT_PLAY_EVENT, play);
    };
}

export default PlayHeaderController;
