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
    validate (data) {

        // TODO: Split throw into two
        if (arguments.length < 1) {

            throw new Error('Invoking Entity.validate without passing a JSON object and/or schema!');
        }

        // TODO: validate this.schema by setting schema in entity constructor
        let validation = tv4.validateMultiple(data, this.schema);

        return validation;
    }
}

export default Entity;
