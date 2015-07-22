import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class DropdownField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);
        this.availableValues = JSON.parse(field.options).map(content => {
            return {content, name: content};
        });
        let initialOption = {
            content: !field.isRequired ? null : undefined,
            name: !field.isRequired ? 'Optional' : 'Select'
        };
        this.availableValues.unshift(initialOption);
        let dropdownOption = angular.copy(this.availableValues[0]);

        if (field.value) {
            dropdownOption.content = field.value;
            dropdownOption.name = field.value;
        }

        this.currentValue = dropdownOption;
    }

    get currentValue(){
        return this.value;
    }

    set currentValue(dropdownOption) {
        this.value = dropdownOption;
    }

    toJSON() {
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.content
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default DropdownField;
