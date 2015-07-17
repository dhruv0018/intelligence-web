import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class YardField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let yard = {
            content: !field.isRequired ? null : undefined,
            name: !field.isRequired ? 'Optional' : 'Select'
        };

        if (field.value) {
            yard.content = Number(field.value);
            yard.name = field.value;
        }

        this.currentValue = yard;

        this.availableValues = [];

        this.availableValues = Array.from(new Array(99), (item, yardLength) => {
            return {content: yardLength + 1, name: yardLength + 1};
        });

    }

    get currentValue() {
        return this.value;
    }

    set currentValue(yard) {
        let value = {};
        value.name = yard.name;
        value.content = yard.content;
        this.value = value;
    }

    /**
     * Method: toString
     * Generates an HTML string of the field.
     *
     * @return: {String} HTML of the field
     */
    toString () {

        return `<span class="value">${this.currentValue.content}</span>`;
    }

    toJSON() {
        let variableValue = {};
        let value = (!this.isRequired && this.value.content === null) ? null : String(this.value.content);
        variableValue = {
            type: null,
            value
        };

        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default YardField;
