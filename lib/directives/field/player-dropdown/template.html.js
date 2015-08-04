export default (templateUrl) => `

<input
    type="text"
    id="field-{{field.index}}"
    class="player-typeahead mousetrap"
    tab-index="{{field.index}}"
    ng-model="displayValue"
    ng-blur="onBlur($event)"
    ng-focus="onFocus($event)"
    typeahead="value as value.name for value in field.availableValues | filter:{ name: $viewValue } | orderBy:'jerseyNumber'"
    typeahead-on-select="onSelect($item)"
    typeahead-template-url="${templateUrl}"
    typeahead-append-to-body="true"
    typeahead-editable="false"
>

`;
