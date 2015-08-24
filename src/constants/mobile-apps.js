const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const MOBILE_APP_URLS = {

    COACH: {

        IOS: 'http://itunes.com/apps/krossoverintelligenceinc/krossovercoach',
        ANDROID: 'https://play.google.com/store/apps/details?id=com.krossover.coach'
    },

    ATHLETE: {

        IOS: 'http://itunes.com/apps/krossoverintelligenceinc/krossoverathlete',
        ANDROID: 'https://play.google.com/store/apps/details?id=com.krossover.athlete'
    }
};

const MOBILE_APP_PROMPT_SHOWN = 'MOBILE_APP_PROMPT_SHOWN';

IntelligenceWebClient.constant('MOBILE_APP_URLS', MOBILE_APP_URLS);
IntelligenceWebClient.constant('MOBILE_APP_PROMPT_SHOWN', MOBILE_APP_PROMPT_SHOWN);

export {MOBILE_APP_URLS, MOBILE_APP_PROMPT_SHOWN};
