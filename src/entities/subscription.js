import Entity from './entity.js';

class Subscription extends Entity {

    constructor (subscription) {

        let self = this;

        if (self.validate(subscription)) {

            return self.extend(subscription);
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

        let self = this;

        if (!match) {

            match = subscription;
            subscription = self;
        } else if (!subscription) {

            throw new Error('Subscription.is() requires 1 argument');
        }

        return (subscription.type === match.type.id);
    }

    get active() {

        let self = this;
        let today = Date.now();

        let hasActivated = self.activatesAt > today;
        let hasNotExpired = self.expiresAt < today;

        return (hasActivated && hasNotExpired);
    }
}

export default Subscription;
