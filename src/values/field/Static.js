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

        let value = {

            content: field.value,
            name   : field.value
        };

        this.value = value;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        throw Error('Static class cannot be stringified!');
    }
}

export default StaticField;
