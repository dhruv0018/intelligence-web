export default `

<div class="self-edited-play">

    <div>
        <span class="watch-play" ng-click="onPlayButtonClick()">
                <i class="icon icon-play-circle"></i>
        </span>

        <time>
            {{ play.startTime | time: true }} — <span ng-if="play.endTime > 0">{{ play.endTime | time: true }}</span>
        </time>
    </div>

    <div class="state-actions" ng-show="showStateActions && !showDeleteConfirmationActions">

        <span ng-click="onEditButtonClick()">
            <md-tooltip md-direction="top">Edit Clip Time</md-tooltip>
            <i class="icon icon-pencil"></i>
        </span>

        <span ng-click="showDeleteConfirmationActions = true">
            <md-tooltip md-direction="top">Delete Clip</md-tooltip>
            <i class="icon icon-trash-o"></i>
        </span>

    </div>

    <div class="delete-confirmation-actions" ng-show="showStateActions && showDeleteConfirmationActions" ng-blur="showDeleteConfirmationActions = false">
        <span class="delete-cancel" ng-click="showDeleteConfirmationActions = false">Cancel</span>
        <button class="btn btn-primary" ng-click="onDeleteButtonClick()">Delete</button>
    </div>
</div>

`;
