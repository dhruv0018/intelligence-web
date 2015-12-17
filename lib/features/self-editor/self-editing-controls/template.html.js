export default `

    <div class="tag-button-container">
        <button class="btn btn-primary start-clip-button"
        ng-click="onSetPlayStartTimeClick()"
        ng-show="CURRENT_SET_PLAY_TIME_MODE === SET_PLAY_TIME_MODES.START">

            <span ng-show="CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.CREATE">Start (Enter)</span>
            <span ng-show="CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.EDIT">Update Start Time (Enter)</span>

        </button>

        <button class="btn btn-primary end-clip-button"
        ng-click="onSetPlayEndTimeClick()"
        ng-show="CURRENT_SET_PLAY_TIME_MODE === SET_PLAY_TIME_MODES.END"
        ng-disabled="videoPlayer.currentTime <= currentPlay.startTime">

            <span ng-show="CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.CREATE">End (Enter)</span>
            <span ng-show="CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.EDIT">Update End Time (Enter)</span>

        </button>
    </div>

    <button class="btn btn-default cancel-clip-button"
        ng-click="onCancel()"
        ng-disabled="CURRENT_SET_PLAY_TIME_MODE === SET_PLAY_TIME_MODES.START && CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.CREATE">
            Cancel (Esc)
        </button>

`;
