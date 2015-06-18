import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TextField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let text = {
            content: !field.isRequired? 'Optional' : undefined
        };

        if (field.value) text.content = field.value;

        this.currentValue = text;

        this.availableValues = null;
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(text) {
        let value = {};
        value.content = text.content;
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

export default TextField;
