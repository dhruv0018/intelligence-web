const pkg = require('../package.json');

/* Enable debug information in development. */
const debugInfoEnabled = process.env.NODE_ENV === 'development';

/* Fetch angular from the browser scope */
var angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

config.$inject = [
    '$compileProvider'
];

function config (
    $compileProvider
) {

    $compileProvider.debugInfoEnabled(debugInfoEnabled);
}

IntelligenceWebClient.config(config);
