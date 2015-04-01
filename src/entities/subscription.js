import Entity from './entity.js';

class Subscription extends Entity {

    constructor (subscription) {

        if (this.validate(subscription)) {

            return this.extend(subscription);
        }
    }

    validate (subscription) {

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

    is(subscription, match) {

        if (!match) {

            let self = this;

            match = subscription;
            subscription = self;
        } else if (!subscription) {

            throw new Error('Subscription.is() requires 1 argument');
        }

        return (subscription.type === match.type.id);
    }

    get active() {

        let today = Date.now();

        let hasActivated = this.activatesAt > today;
        let hasNotExpired = this.expiresAt < today;

        return (hasActivated && hasNotExpired);
    }
}

export default Subscription;
