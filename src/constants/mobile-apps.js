const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const MOBILE_APP_URLS = {

    COACH: {

        IOS: 'http://itunes.com/apps/krossoverintelligenceinc/krossovercoach',
        ANDROID: 'https://play.google.com/store/apps/details?id=com.krossover.coach&hl=en'
    },

    ATHLETE: {

        IOS: 'http://itunes.com/apps/krossoverintelligenceinc/krossoverathlete',
        ANDROID: 'https://play.google.com/store/apps/details?id=com.krossover.athlete&hl=en'
    }
};

IntelligenceWebClient.constant('MOBILE_APP_URLS', MOBILE_APP_URLS);

export {MOBILE_APP_URLS};
