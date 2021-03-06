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

        /* TODO: Since we can't use `this` before calling `super`, we need to
         * refactor this to pass the schema in because we can't add the schema
         * to the instance via `this`. */

        if (!this.schema) {

            throw new Error('Invoking Entity.validate without a schema!');
        }

        if (!data) {

            throw new Error('Invoking Entity.validate without passing a JSON object!');
        }

        let validation = tv4.validateMultiple(data, this.schema);

        return validation;
    }
}

export default Entity;
