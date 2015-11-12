var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

const EMAILS = {

    OPERATIONS: 'operations@krossover.com'
};

IntelligenceWebClient.constant('EMAILS', EMAILS);

export default EMAILS;
