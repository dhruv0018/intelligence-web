var IntelligenceWebClient = require('./app');

IntelligenceWebClient.config([
    '$locationProvider',
    function config($locationProvider) {

        $locationProvider.html5Mode(true);
    }
]);

