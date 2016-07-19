import SELF_EDITOR_STATES from '../constants.js';
import PlayList from '../../../../src/collections/playList';

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

SelfEditingPlaylistController.$inject = [
    '$rootScope',
    '$scope',
    '$stateParams',
    'GamesFactory',
    'PlaylistEventEmitter',
    'SelfEditedPlayStateNotifier',
    'CUSTOM_TAGS_EVENTS'
];

function SelfEditingPlaylistController (
    $rootScope,
    $scope,
    $stateParams,
    games,
    playlistEventEmitter,
    SelfEditedPlayStateNotifier,
    CUSTOM_TAGS_EVENTS
) {

    $scope.BREAKDOWN_STATE = SELF_EDITOR_STATES.BREAKDOWN;
    $scope.EDITOR_STATE = SELF_EDITOR_STATES.EDITOR;
    $scope.selectedPlays = [];
    let isEditingPlay = false;
    $scope.tagsApplied = false;
    $scope.multipleTagsApplied = false;
    $scope.addToReeOptions = {scope: $scope};
    $scope.game = games.get($stateParams.id);
    let playToBeEdited = {};
    let lastPlaySelected = {};
    let shiftKeyPressed = false;
    let shiftClickPlaysArray = [];

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

    $rootScope.$on('self-edited-tags-applied', (event, tags) => {
        if (tags.length > 1) {
            $scope.multipleTagsApplied = true;
        }
        $scope.tagsApplied = true;
        setTimeout(() => {
            $scope.tagsApplied = false;
            $scope.multipleTagsApplied = false;
            $scope.$apply();
        }, 1500);
    });

    // Uncheck all plays when custom tags get saved
    playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, customTagsEvent => {
        $scope.selectedPlays = [];
    });

    Mousetrap.bind('shift', function(e) {
        shiftKeyPressed = e.shiftKey;
    }, 'keydown');

    Mousetrap.bind('shift', function(e) {
        shiftKeyPressed = e.shiftKey;
    }, 'keyup');

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
            if(shiftKeyPressed) {
                const lastPlayIndex = $scope.filteredPlayList.identity.indexOf(lastPlaySelected);
                const shiftClickPlayIndex = $scope.filteredPlayList.identity.indexOf(play);
                if (lastPlayIndex < shiftClickPlayIndex) {
                    shiftClickPlaysArray = $scope.filteredPlayList.identity.slice(lastPlayIndex, (shiftClickPlayIndex + 1));
                } else {
                    shiftClickPlaysArray = $scope.filteredPlayList.identity.slice(shiftClickPlayIndex, (lastPlayIndex + 1));
                }
                shiftClickPlaysArray.forEach(play => selectPlay(play));
            } else {
                selectPlay(play);
            }
            lastPlaySelected = play;
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

    $scope.isPlayContainingTelestration = function(play) {
        let result = false;
        $scope.game.selfEditedTelestrations.map((tel) => {
            if (tel.time >= play.startTime && tel.time <= play.endTime) {
                result = true;
            }
        });
        return result;
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
            var topPos = myElement.offsetTop -130;
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
