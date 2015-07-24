import Field from './Field';

/**
 * StaticField Field Model
 * @class StaticField
 */
class StaticField extends Field {

    /**
     * @constructs StaticField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field && !field.value) {

            throw new Error('StaticField constructor requires a field!');
        }

        super(field);

        this.currentValue = field.value;
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

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        return this.currentValue;
    }
}

export default StaticField;
