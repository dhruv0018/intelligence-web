export default `
    <button ng-click="onClick()"
            id="{{buttonId}}"
            class="btn btn-primary"
            ng-disabled="disabled || resource.isSaving || preSaving">

        <span ng-show="!resource.isSaving && !preSaving">Save</span>
        <span ng-show="resource.isSaving || preSaving" class="icon icon-spinner spinner"></span>

    </button>
`;
