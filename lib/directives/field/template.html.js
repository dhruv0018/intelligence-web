//jshint ignore: start
export default `
<span class="item">
    <span class="player-dropdown">
        <a ng-click="chooseField()" class="field-display" ng-hide="isSelecting">
            <span ng-show="selectedValue.name.length > 0">
                {{selectedValue.name}}
            </span>
            <span ng-show="selectedValue.name.length === 0 || !selectedValue.name">
                <span ng-show="field.isRequired">Select</span>
                <span ng-show="!field.isRequired">Optional</span>
            </span>
        </a>
        <input
            ng-show="isSelecting"
            type="text"
            class="player-dropdown mousetrap"
            ng-model="selectedValue"
            placeholder="Select"
            data-typeahead="value as value.name for value in field.availableValues | filter:{ name: $viewValue } | orderBy:'jerseyNumber'"
            data-typeahead-on-select="selectValue($item)"
            data-typeahead-template-url="field/dropdown-input.html"
            typeahead-append-to-body="true"
            data-ng-blur="onBlur()"
            ng-focus="onFocus()"
            typeahead-editable="false"
            data-focus-on="shouldFocus()"
            data-ng-change="onChange()"
            tabindex="{{field.order}}"
        >

    </span>
</span>
`;
