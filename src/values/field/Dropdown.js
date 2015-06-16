import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class DropdownField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let value = {
            content: !field.isRequired ? 'Optional' : null
        };

        if (field.value) {
            value.content = field.value;
        }

        this.value = value;
        this.availableOptions = JSON.parse(field.options);
    }

    toJSON() {
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.content
        };
        return JSON.stringify(variableValue);
    }
}

export default DropdownField;
