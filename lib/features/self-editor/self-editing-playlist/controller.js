import SELF_EDITOR_STATES from '../constants.js';
import PlayList from '../../../../src/collections/playList';

SelfEditingPlaylistController.$inject = [
    '$rootScope',
    '$scope',
    'PlaylistEventEmitter',
    'SelfEditedPlayStateNotifier',
    'CUSTOM_TAGS_EVENTS'
];

function SelfEditingPlaylistController (
    $rootScope,
    $scope,
    playlistEventEmitter,
    SelfEditedPlayStateNotifier,
    CUSTOM_TAGS_EVENTS
) {

    $scope.BREAKDOWN_STATE = SELF_EDITOR_STATES.BREAKDOWN;
    $scope.EDITOR_STATE = SELF_EDITOR_STATES.EDITOR;
    $scope.selectedPlays = [];
    let isEditingPlay = false;
    let playToBeEdited = {};

    $rootScope.$on('self-edited-play-controls-enable-edit-mode', function(event, play) {
        isEditingPlay = true;
        playToBeEdited = play;
    });

    $rootScope.$on('self-edited-play-controls-disable-edit-mode', function(event, play) {
        isEditingPlay = false;
        playToBeEdited = {};
    });

    $rootScope.$on('self-edited-plays-filter-selected', (event, filter) => {
        $scope.selectedPlays = [];
        $scope.filteredPlayList.data = $scope.playList.identity.filter(filter);
    });

    $rootScope.$on('self-edited-plays-filter-cleared', (event) => {
        $scope.selectedPlays = [];
        $scope.filteredPlayList.data = $scope.playList.identity;
    });

    $rootScope.$on('self-edited-play-state-notifier-did-delete', (event, play) => {
        deselectPlay(play);
    });

    $rootScope.$on('self-edited-play-state-notifier-did-create', (event, play) => {
        play.newPlayInProgress = true;
        clearNewPlayStatus();
        play.newPlay = true;
        scrollToPlay();
    });

    $rootScope.$on('self-edited-play-state-notifier-did-create-finish', (event, play) => {
        play.newPlayInProgress = false;
        play.newPlayFinished = true;
    });

    $rootScope.$on('self-edited-play-state-notifier-did-create-finish-clear', (event) => {
        clearNewPlayStatus();
        deleteIfIncompletePlay();
    });

    // Uncheck all plays when custom tags get saved
    playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, customTagsEvent => {
        $scope.selectedPlays = [];
    });

    $scope.isPlaySelectedForEditing = function(play) {
        let isPlayToBeEdited = playToBeEdited.id === play.id;
        return isEditingPlay && isPlayToBeEdited;
    };

    $scope.isPlayNotSelectedForEditing = function(play) {
        let isPlayToBeEdited = playToBeEdited.id === play.id;
        return isEditingPlay && !isPlayToBeEdited;
    };

    $scope.togglePlaySelection = function(play) {
        if (isPlaySelected(play)) {
            deselectPlay(play);
        } else if (!isPlaySelected(play)) {
            selectPlay(play);
        }
    };

    $scope.toggleSelectAllPlays = function() {
        if ($scope.selectedPlays.length === $scope.filteredPlayList.identity.length) {
            $scope.filteredPlayList.identity.forEach(play => deselectPlay(play));
        } else {
            $scope.filteredPlayList.identity.forEach(play => selectPlay(play));
        }
    };

    $scope.isPlayNewlyMade = function(play) {
        return play.newPlay;
    };

    $scope.isPlayNewlyMadeFinished = function(play) {
        return play.newPlayFinished;
    };

    function clearNewPlayStatus() {
        $scope.playList.data.map(play => {
            play.newPlay = false;
            play.newPlayFinished = false;
        });
    }

    function deleteIfIncompletePlay() {
        $scope.playList.data.map(play => {
            if(play.endTime === '') {
                SelfEditedPlayStateNotifier.notifyDidDelete(play);
            }
        });
    }

    function scrollToPlay() {
        setTimeout(function(){
            var myElement = document.getElementsByClassName('play-is-newly-made')[0];
            var topPos = myElement.offsetTop -110;
            document.getElementsByClassName('self-editing-playlist')[0].parentElement.scrollTop = topPos;
        },100);
    }

    $scope.isPlaySelected = isPlaySelected;

    function isPlaySelected(play) {
        return $scope.selectedPlays.some(selectedPlay => play.id === selectedPlay.id);
    }

    function selectPlay(play) {
        if (!isPlaySelected(play)) {
            $scope.selectedPlays.push(play);
        }
    }

    function deselectPlay(play) {
        if (isPlaySelected(play)) {
            let index = $scope.selectedPlays.indexOf(play);
            $scope.selectedPlays.splice(index, 1);
        }
    }
}

export default SelfEditingPlaylistController;
