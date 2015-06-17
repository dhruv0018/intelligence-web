import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class DropdownField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let value = {
            content: !field.isRequired ? 'Optional' : undefined
        };

        if (field.value) {
            value.content = field.value;
        }

        this.value = value;
        this.availableValues = JSON.parse(field.options);
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
