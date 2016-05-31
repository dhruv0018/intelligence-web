export default `

    <div class="tag-button-container">
        <button class="btn btn-rounded start-clip-button"
        ng-click="onSetPlayStartTimeClick()"
        ng-show="CURRENT_SET_PLAY_TIME_MODE === SET_PLAY_TIME_MODES.START">

            <div class="icon icon-plus"></div>
            <span ng-show="CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.CREATE"> Create Clip</span>
            <span ng-show="CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.EDIT"> Update Start Time</span>

        </button>

        <button class="btn btn-rounded end-clip-button"
        ng-click="onSetPlayEndTimeClick()"
        ng-show="CURRENT_SET_PLAY_TIME_MODE === SET_PLAY_TIME_MODES.END">

            <div class="icon icon-stop"></div>
            <span ng-show="CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.CREATE"> End Clip</span>
            <span ng-show="CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.EDIT"> Update End Time</span>

        </button>
    </div>

    <div class="cancel-clip-button"
        ng-click="onCancel()"
        ng-hide="CURRENT_SET_PLAY_TIME_MODE === SET_PLAY_TIME_MODES.START && CURRENT_PLAY_MODEL_STATE_MODE === PLAY_MODEL_STATE_MODES.CREATE">
            Cancel
        </div>

`;
