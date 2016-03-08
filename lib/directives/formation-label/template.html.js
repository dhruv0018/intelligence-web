export default `

    <md-tooltip md-direction="top" ng-if="!isEditingLabel">Edit Formation Name</md-tooltip>
    <span class="label-text" ng-show="formationLabel && !isEditingLabel" ng-click="onEditClick($event)">{{formationLabel}}</span>
    <span class="label-empty-state" ng-hide="formationLabel || isEditingLabel" ng-click="onEditClick($event)">Add Formation Name</span>
    <input
        id="formation-label-input"
        class="label-input"
        type="text"
        maxlength="30"
        ng-model="$parent.formationLabel"
        ng-if="isEditingLabel"
        ng-click="onInputClick($event)"
        ng-keydown="onKeyPress($event)"
        autofocus>
    </input>

    <i class="icon icon-pencil" ng-hide="isEditingLabel" ng-click="onEditClick($event)"></i>
    <button class="btn btn-xs btn-default" ng-show="isEditingLabel" ng-click="onCancelClick($event)">Cancel</button>
    <button class="btn btn-xs btn-primary" ng-show="isEditingLabel" ng-click="onSaveClick($event)">Save</button>
`;
