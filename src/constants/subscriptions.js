const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const SUBSCRIPTION_ID = {

    1: 'ATHLETE_PLUS',
    2: 'ATHLETE_RECRUIT'
};

IntelligenceWebClient.constant('SUBSCRIPTION_ID', SUBSCRIPTION_ID);

const SUBSCRIPTION_TYPE = {

    ATHLETE_PLUS: 1,
    ATHLETE_RECRUIT: 2
};

IntelligenceWebClient.constant('SUBSCRIPTION_TYPE', SUBSCRIPTION_TYPE);

const SUBSCRIPTIONS = {

    ATHLETE_PLUS: {

        type: {

            id: SUBSCRIPTION_TYPE.ATHLETE_PLUS,
            name: 'Athlete Plus'
        }
    },

    ATHLETE_RECRUIT: {

        type: {

            id: SUBSCRIPTION_TYPE.ATHLETE_RECRUIT,
            name: 'Athlete Recruit'
        }
    }
};

IntelligenceWebClient.constant('SUBSCRIPTIONS', SUBSCRIPTIONS);
