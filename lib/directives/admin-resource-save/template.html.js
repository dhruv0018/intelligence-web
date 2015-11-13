export default `
    <button ng-click="onClick()" id="{{buttonId}}" class="btn btn-primary" ng-disabled="disabled || resource.isSaving">
        <span ng-show="!resource.isSaving">Save</span>
        <span ng-show="resource.isSaving" class="icon icon-spinner spinner"></span>
    </button>
`;
