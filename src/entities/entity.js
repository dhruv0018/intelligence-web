const tv4 = require('tv4');

/**
 * Entity Model
 * @class Entity
 */
class Entity {

    /**
     * @constructs Entity
     * @param {Object} entity - JSON from server
     */
    constructor (entity) {

        Object.assign(this, entity);
    }

    /**
     * Checks a JSON subscription object for valid properties
     *
     * @method validate
     * @param {Object} data - JSON object to validate
     * @returns {Boolean}   - true if valid object
     */
    validate (data, schema) {

        if (arguments.length < 2) {

            throw new Error('Invoking Entity.validate without passing a JSON object and/or schema!');
        }

        let validation = tv4.validateMultiple(data, schema);

        return validation;
    }
}

export default Entity;
