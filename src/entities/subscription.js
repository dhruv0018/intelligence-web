import Entity from './entity.js';

const tv4 = require('tv4');
const SCHEMAS_PATH = '../../schemas/';
const schema = require(SCHEMAS_PATH + 'subscription.json');

class Subscription extends Entity {

    /**
     * Constructor:
     * Instantaties new Subscription entity
     *
     * @param: {Object} (req) JSON object to copy/instantiate
     * @return: {Subscription} New subscription
     */
    constructor (subscription) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Subscription.constructor without passing a JSON object');
        }

        let validation = this.validate(subscription);

        if (validation.errors.length) {

            throw new Error(validation.errors.shift());
        }

        return this.extend(subscription);
    }

    /**
     * Method:validate
     * Checks a JSON subscription object for valid properties
     *
     * @param: {Object} (req) JSON object to validate
     * @return: {Boolean} [true] if valid object
     */
    validate (subscription) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Subscription.validate without passing a JSON object');
        }

        let recursion = true;
        let validation =  tv4.validateMultiple(subscription, schema, recursion);

        return validation;
    }

    /**
     * Method:is
     * Determine type of given subscription
     *
     * @param: {SUBSCRIPTION} (req) Subscription constant to check against
     * @return: {Boolean} [true] if given subscription matches given type, else [false]
     */
    is (match) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Subscription.is without passing a SUBSCRIPTION to match');
        }

        return this.type === match.type.id;
    }

    /**
     * Method:isActive
     * Determine if given subscription is active
     *
     * @return: {Boolean} [true] if active, else [false]
     */
    get isActive() {

        let today = moment.utc();
        let activation = moment(this.activatesAt).utc();
        let expiration = moment(this.expiresAt).utc();

        return today.isAfter(activation) && today.isBefore(expiration);
    }
}

export default Subscription;
