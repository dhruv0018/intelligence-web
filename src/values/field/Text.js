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
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value text-field">${this.currentValue.content}</span>`;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};

        variableValue = {
            type: null,
            value: this.value.content
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default TextField;
