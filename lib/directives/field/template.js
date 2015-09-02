import dropdownTemplateString from './dropdown-input.html.js';
let dropdownUrl = 'field/dropdown-input.html';
let viewFilter = '{name: $viewValue}';

class FieldTemplate {

    constructor(dropdownTemplateUrl = dropdownUrl, dropdownTemplate = dropdownTemplateString, filter = viewFilter) {

        this.dropdownTemplateUrl = dropdownTemplateUrl;
        this.dropdownTemplate = dropdownTemplate;
        this.filter = filter;
    }

    get template() {

        return `

        <input
            type="text"
            id="field-{{:: field.index}}"
            class="field-typeahead mousetrap"
            ng-class="{
                'field-valid': field.valid,
                'field-invalid': !field.valid,
                'field-required': field.isRequired,
                'field-optional': !field.isRequired
            }"
            placeholder="{{::field.name}}"
            size="{{(displayValue.name.length > 0) ? (displayValue.name.length + 1) : 10}}"
            tab-index="{{:: field.index}}"
            ng-model="displayValue"
            ng-blur="onBlur($event)"
            ng-focus="onFocus($event)"
            typeahead="value as value.name for value in ::field.availableValues | filter: ${this.filter} | orderBy:'order'"
            typeahead-on-select="onSelect($item)"
            typeahead-template-url="${this.dropdownTemplateUrl}"
            typeahead-append-to-body="false"
            typeahead-editable="false"
            typeahead-min-length="0"
        >

        `;
    }
}

export default FieldTemplate;
