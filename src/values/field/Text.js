import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TextField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let initialText = {
            content: !field.isRequired? null : undefined,
            name: !field.isRequired? 'Optional': 'Select'
        };

        if (field.value) {
            let value = angular.copy(field.value);
            initialText.content = value;
            initialText.name = value;
        }

        this.currentValue = initialText;

        this.availableValues = null;
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(text) {
        this.value = text;
    }

    /**
     * Method: toString
     * Generates an HTML string of the field.
     *
     * @return: {String} HTML of the field
     */
    toString () {

        return `<span class="value text-field">${this.value.content}</span>`;
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
