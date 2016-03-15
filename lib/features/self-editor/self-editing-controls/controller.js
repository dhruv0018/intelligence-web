const SET_PLAY_START_TIME_MODE = 1;
const SET_PLAY_END_TIME_MODE = 2;
const SET_PLAY_TIME_MODES = {
    START: SET_PLAY_START_TIME_MODE,
    END: SET_PLAY_END_TIME_MODE
};

const CREATE_PLAY_MODEL_STATE_MODE = 1;
const EDIT_PLAY_MODEL_STATE_MODE = 2;
const PLAY_MODEL_STATE_MODES = {
    CREATE: CREATE_PLAY_MODEL_STATE_MODE,
    EDIT: EDIT_PLAY_MODEL_STATE_MODE
};

const Mousetrap = window.Mousetrap;

SelfEditingControlsController.$inject = [
    '$scope',
    'SelfEditedPlaysFactory',
    'SelfEditedPlayControlsModeNotifier',
    'SelfEditedPlayStateNotifier',
    'VideoPlayer',
    'CUEPOINT_CONSTANTS'
];

function SelfEditingControlsController (
    $scope,
    selfEditedPlays,
    selfEditedPlayControlsModeNotifier,
    selfEditedPlayStateNotifier,
    videoPlayer,
    CUEPOINT_CONSTANTS
) {

    $scope.SET_PLAY_TIME_MODES = SET_PLAY_TIME_MODES;
    $scope.PLAY_MODEL_STATE_MODES = PLAY_MODEL_STATE_MODES;

    $scope.videoPlayer = videoPlayer;

    setDefaultEditingControlState();

    $scope.onSetPlayStartTimeClick = onSetPlayStartTimeClick;
    $scope.onSetPlayEndTimeClick = onSetPlayEndTimeClick;
    $scope.onCancel = onCancel;

    // Keybindings

    Mousetrap.bind('enter', e => {
        e.preventDefault();
        $scope.$apply(() => {
            if ($scope.CURRENT_SET_PLAY_TIME_MODE === SET_PLAY_TIME_MODES.START) {
                onSetPlayStartTimeClick();
            } else if ($scope.CURRENT_SET_PLAY_TIME_MODE === SET_PLAY_TIME_MODES.END && videoPlayer.currentTime > $scope.currentPlay.startTime) {
                onSetPlayEndTimeClick();
            }
        });
    });

    Mousetrap.bind('esc', e => {
        e.preventDefault();
        $scope.$apply(() => {
            onCancel();
        });
    });

    // When the directive is destroyed, unbind and reset
    $scope.$on('$destroy', () => {
        clearCurrentPlay();
        clearCuePoints();
        Mousetrap.unbind('enter');
        Mousetrap.unbind('esc');
    });

    // Event listener for edit state
    $scope.$on('self-edited-play-controls-enable-edit-mode', function(event, play) {

        // pause the video
        videoPlayer.pause();
        // seek to the play's startTime
        videoPlayer.seekTime(play.startTime);

        // set the current play
        $scope.currentPlay = play;

        // create copy of startTime
        $scope.startTimeCopy = play.startTime;

        // enter EDIT_PLAY_MODEL_STATE_MODE
        $scope.CURRENT_PLAY_MODEL_STATE_MODE = PLAY_MODEL_STATE_MODES.EDIT;
    });

    $scope.$on('self-edited-play-controls-disable-edit-mode', function(event, play) {
        $scope.CURRENT_PLAY_MODEL_STATE_MODE = PLAY_MODEL_STATE_MODES.CREATE;
    });

    $scope.$on('self-edited-play-start-notifier-reset-to-default-mode', function(event) {
        clearCurrentPlay();
        clearCuePoints();
        $scope.CURRENT_PLAY_MODEL_STATE_MODE = PLAY_MODEL_STATE_MODES.CREATE;
    });

    /* onSetPlayStartTimeClick handles setting the startTime of a new or existing play,
     * and cleanly transitioning out of the START mode into END mode
     */
    function onSetPlayStartTimeClick() {

        createOrUpdateSelfEditedPlayWithStartTime();

        // set a cuePoint on the videoPlayer for the startTime
        setCurrentPlayStartTimeCuePoint();

        $scope.CURRENT_SET_PLAY_TIME_MODE = SET_PLAY_TIME_MODES.END;
    }

    /* onSetPlayEndTimeClick handles setting the endTime of a new or existing play */
    function onSetPlayEndTimeClick() {
        videoPlayer.pause();
        $scope.currentPlay.setEndTime(videoPlayer.currentTime);
        $scope.currentPlay.save().then(onSavePlay);
    }

    function onCancel() {
        if ($scope.CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.EDIT) {
            $scope.currentPlay.startTime = $scope.startTimeCopy;
        }

        setDefaultEditingControlState();
    }

    function setDefaultEditingControlState() {

        if ($scope.CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.EDIT) {
            selfEditedPlayControlsModeNotifier.notifyDisableEditMode($scope.currentPlay);
        }

        $scope.CURRENT_PLAY_MODEL_STATE_MODE = PLAY_MODEL_STATE_MODES.CREATE;
        $scope.CURRENT_SET_PLAY_TIME_MODE = SET_PLAY_TIME_MODES.START;
        clearCurrentPlay();
        clearCuePoints();
    }

    // NON-VIEW-RELATED FUNCTIONS

    /* createOrUpdateSelfEditedPlayWithStartTime will create a new play if
     * the current state of self-editing-controls is CREATE OR update
     * the currentPlay's startTime
     */
    function createOrUpdateSelfEditedPlayWithStartTime() {
        if ($scope.CURRENT_PLAY_MODEL_STATE_MODE == PLAY_MODEL_STATE_MODES.EDIT) {
            $scope.currentPlay.setStartTime(videoPlayer.currentTime);
        } else if ($scope.CURRENT_PLAY_MODEL_STATE_MODE == PLAY_MODEL_STATE_MODES.CREATE) {
            createSelfEditedPlay();
        }
    }

    /* createSelfEditedPlay will create a selfEditedPlay with the
     * current time of the videoPlayer and the given gameId
     */
    function createSelfEditedPlay() {

        if ($scope.CURRENT_PLAY_MODEL_STATE_MODE !== PLAY_MODEL_STATE_MODES.CREATE) return;

        $scope.currentPlay = selfEditedPlays.create();
        // when creating a new play, set the gameId
        $scope.currentPlay.gameId = $scope.game.id;
        // set the start time on the play
        $scope.currentPlay.setStartTime(videoPlayer.currentTime);
    }

    function setCurrentPlayStartTimeCuePoint() {
        let cuePoint = {
            time: videoPlayer.currentTime,
            type: CUEPOINT_CONSTANTS.TYPES.SELF_EDITOR
        };
        $scope.cuePoints.push(cuePoint);
    }

    function onSavePlay() {

        // If play is newly created, notify selfEditedPlayStateNotifier
        if ($scope.CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.CREATE) {
            selfEditedPlayStateNotifier.notifyDidCreate($scope.currentPlay);
        }

        // reset editing controls
        setDefaultEditingControlState();
    }

    function clearCurrentPlay() {
        $scope.currentPlay = {};
    }

    function clearCuePoints() {
        $scope.cuePoints = [];
    }
}

export default SelfEditingControlsController;