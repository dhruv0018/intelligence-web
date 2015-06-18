import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class DropdownField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let dropdownOption = {
            content: !field.isRequired ? 'Optional' : undefined
        };

        if (field.value) dropdownOption.content = field.value;

        this.currentValue = dropdownOption;
        this.availableValues = JSON.parse(field.options).map(content => { return {content}; });
    }

    get currentValue(){
        return this.value;
    }

    set currentValue(dropdownOption) {
        let value = {};
        value.content = dropdownOption.content;
        this.value = value;
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
