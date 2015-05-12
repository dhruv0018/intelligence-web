const pkg = require('../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

let features;

const ENV = process.env.NODE_ENV;

if (ENV === 'test') {

    features = require('../config/test/features.json');
}

else if (ENV === 'development') {

    features = require('../config/dev/features.json');
}

else if (ENV === 'qa') {

    features = require('../config/qa/features.json');
}

else if (ENV === 'uat') {

    features = require('../config/uat/features.json');
}

else {

    features = require('../config/prod/features.json');
}

IntelligenceWebClient.constant('FEATURES', features);
