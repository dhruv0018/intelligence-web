export default
`<span class="dropdown">
    <a
        ng-click="chooseField()"
        class="field-display"
        ng-hide="isSelecting"
        id="field-{{field.index}}"
        tab-index="{{field.index}}"
    >
        <span ng-show="displayValue.name.length > 0">
            {{displayValue.name}}
        </span>
        <span ng-show="displayValue.name.length === 0 || !displayValue.name">
            <span ng-show="field.isRequired">Select</span>
            <span ng-show="!field.isRequired">Optional</span>
        </span>
    </a>
</span>`;
