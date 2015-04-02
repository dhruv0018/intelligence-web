import Entity from './entity.js';

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

        if (this.validate(subscription)) {

            return this.extend(subscription);
        }
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

        // TODO: Validate with JSON schema instead
        /* Validate JSON constructor object */
        if (!subscription.id) {

            throw new Error('Instantiating a Subscription Entity requires :id');
        } else if (!subscription.type) {

            throw new Error('Instantiating a Subscription Entity requires :type');
        } else if (!subscription.activatesAt) {

            throw new Error('Instantiating a Subscription Entity requires :activatesAt');
        } else if (!subscription.expiresAt) {

            throw new Error('Instantiating a Subscription Entity requires :expiresAt');
        } else if (
            (subscription.userId && subscription.teamId) ||
            (!subscription.userId && !subscription.teamId)
        ) {

            throw new Error('Instantiating a Subscription Entity requires mutually exclusive :userId and :teamId');
        }

        return true;
    }

    /**
     * Method:is
     * Determine type of given subscription
     *
     * @param: {SUBSCRIPTION} (req) Subscription constant to check against
     * @param: {Subscription} (opt) Subscription object to check type of
     * @return: {Boolean} [true] if given subscription matches given type, else [false]
     */
    is(match, subscription = this) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Subscription.is without passing a SUBSCRIPTION to match');
        }

        return (subscription.type === match.type.id);
    }

    /**
     * Method:isActive
     * Determine if given subscription is active
     *
     * @return: {Boolean} [true] if active, else [false]
     */
    get isActive() {

        let today = Date.now();

        let hasActivated = this.activatesAt > today;
        let hasNotExpired = this.expiresAt < today;

        return (hasActivated && hasNotExpired);
    }
}

export default Subscription;
