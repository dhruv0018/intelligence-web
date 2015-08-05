export default (templateUrl) => `

<input
    type="text"
    id="field-{{field.index}}"
    class="team-player-typeahead mousetrap"
    tab-index="{{field.index}}"
    ng-model="displayValue"
    ng-blur="onBlur($event)"
    ng-focus="onFocus($event)"
    typeahead="value as value.name for value in field.availableValues | filter:{ name: $viewValue }"
    typeahead-on-select="onSelect($item)"
    typeahead-template-url="${templateUrl}"
    typeahead-append-to-body="true"
    typeahead-editable="false"
    typeahead-min-length="0"
>

`;
