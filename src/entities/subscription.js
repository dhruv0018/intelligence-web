
import Entity from './entity.js';

const tv4 = require('tv4');
const schema = require('../../schemas/subscription.json');
const moment = require('moment');

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

        let validation =  tv4.validateMultiple(subscription, schema);

        return validation;
    }

    /**
     * Method:is
     * Determine type of given subscription
     *
     * @param: {SUBSCRIPTION} (req) Subscription constant to check against
     * @return: {Boolean} [true] if given subscription matches given type, else [false]
     */
    is (subscriptionConstant) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Subscription.is without passing a SUBSCRIPTION to match');
        }

        return this.type === subscriptionConstant.type.id;
    }

    /**
     * Method:isActive
     * Determine if given subscription is active and of the given type
     *
     * @param: {SUBSCRIPTION} Subscription constant to check against
     * @return: {Boolean} [true] if active and given subscription matches given type, else [false]
     */
    isActive(subscriptionConstant) {

        const now = moment.utc();
        const activation = moment.utc(this.activatesAt);
        const expiration = moment.utc(this.expiresAt);

        const isActive = now.isAfter(activation) && now.isBefore(expiration);

        return subscriptionConstant ? (this.is(subscriptionConstant) && isActive) : isActive;
    }
}

export default Subscription;
