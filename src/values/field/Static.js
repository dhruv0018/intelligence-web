import Field from './Field.js';

class StaticField extends Field {

    constructor (field) {

        if (!field && !field.value) {

            throw new Error('StaticField constructor requires a field!');
        }

        super(field);

        this.currentValue = field.value;
    }

    get currentValue () {

        return this.value;
    }

    set currentValue (text) {

        this.value = text;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="static static-field">${this.currentValue}</span>`;
    }

    toJSON () {

        return this.currentValue;
    }
}

export default StaticField;
