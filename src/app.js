var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name, [
    'ngSanitize',
    'ngResource',
    'flow',
    'ui.router',
    'ui.bootstrap',
    'config',
    'App',
    'Modals',
    'Filters',
    'Directives'
]);

