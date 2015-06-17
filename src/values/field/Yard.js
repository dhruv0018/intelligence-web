import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class YardField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let value = {
            content: !field.isRequired ? 'Optional' : null
        };

        if (field.value) {
            value.content = field.value;
        }

        this.availableValues = [];

        for (let yard = 1; yard < 100; yard++) {
            this.availableValues.push(yard);
        }

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

export default YardField;
