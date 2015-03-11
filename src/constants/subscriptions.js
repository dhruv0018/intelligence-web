var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var SUBSCRIPTION_ID = {

    0: 'ATHLETE_PLUS',
    1: 'ATHLETE_RECRUIT'
};

IntelligenceWebClient.constant('SUBSCRIPTION_ID', SUBSCRIPTION_ID);

var SUBSCRIPTION_TYPE = {

    ATHLETE_PLUS: 0,
    ATHLETE_RECRUIT: 1
};

IntelligenceWebClient.constant('SUBSCRIPTION_TYPE', SUBSCRIPTION_TYPE);

var SUBSCRIPTIONS = {

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
