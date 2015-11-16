import dropdownTemplateString from '../dropdown-input.html.js';
const dropdownTemplateUrl = 'field/dropdown-input.html';

export default `

<input
    type="text"
    id="field-{{:: field.index}}"
    class="yard-field mousetrap"
    ng-class="{
        'field-valid': field.valid,
        'field-invalid': !field.valid,
        'field-required': field.isRequired,
        'field-optional': !field.isRequired,
        'no-edit': (!userIsIndexer && leagueHasFormatting)
    }"
    placeholder="{{field.placeholder}}"
    size="{{(displayValue.name.length > 0) ? (displayValue.name.length + 1) : 18}}"
    tab-index="{{:: field.index}}"
    ng-model="displayValue"
    ng-blur="onBlur($event)"
    ng-focus="onFocus($event)"
    typeahead="value as value.name for value in ::field.availableValues | filter: {name: $viewValue} | orderBy:'order'"
    typeahead-on-select="onSelect($item)"
    typeahead-template-url="${dropdownTemplateUrl}"
    typeahead-append-to-body="true"
    typeahead-editable="false"
    typeahead-min-length="0"
    typeahead-input-formatter="yardFormatter($model)"
>

`;
