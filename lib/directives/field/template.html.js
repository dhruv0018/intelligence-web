export default `

<input
    type="text"
    id="field-{{field.index}}"
    class="field-typeahead mousetrap"
    ng-class="{
        'field-valid': field.valid,
        'field-invalid': !field.valid,
        'field-required': field.isRequired,
        'field-optional': !field.isRequired
    }"
    size="{{(displayValue.name.length > 0) ? (displayValue.name.length + 1) : 10}}"
    tab-index="{{field.index}}"
    ng-model="displayValue"
    ng-blur="onBlur($event)"
    ng-focus="onFocus($event)"
    typeahead="value as value.name for value in field.availableValues | filter:{ name: $viewValue } | orderBy:'order'"
    typeahead-on-select="onSelect($item)"
    typeahead-template-url="field/dropdown-input.html"
    typeahead-append-to-body="false"
    typeahead-editable="false"
    typeahead-min-length="0"
>

`;
