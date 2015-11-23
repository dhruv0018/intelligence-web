var pkg = require('../package.json');

let host = window.location.host;

if (host === 'new.krossover.com') {

    document.location.assign(`http://app.krossover.com${window.location.pathname}`);
} else if (host === 'v2-pre-prod.krossover.com') {

    document.location.assign(`http://v2-pre-prod-app.krossover.com${window.location.pathname}`);
}

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name, [
    'KrossoverBlurOnSelect',
    'ngSanitize',
    'ngResource',
    'angulartics',
    'angulartics.segment.io',
    'flow',
    'ui.router',
    'ui.bootstrap',
    'config',
    'App',
    'Modals',
    'Filters',
    'Directives',
    'Dialogs',
    'OnFileChange',
    'FitElement',
    'KrossoverCheckbox',
    'KrossoverMultiselect',
    'Pills',
    'KrossoverTags'
]);
