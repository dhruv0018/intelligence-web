var pkg = require('../package.json');

let host = window.location.host;

if (host === 'new.krossover.com') {

    document.location.assign(`http://app.krossover.com${window.location.pathname}${window.location.search}`);
} else if (host === 'v2-pre-prod.krossover.com') {

    document.location.assign(`http://v2-pre-prod-app.krossover.com${window.location.pathname}${window.location.search}`);
}

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name, [
    'KrossoverBlurOnSelect',
    'ngSanitize',
    'ngResource',
    'angulartics',
    'angulartics.segment.io',
    'ui.router',
    'ui.bootstrap',
    'config',
    'App',
    'Lib',
    'OnFileChange',
    'FitElement',
    'KrossoverCheckbox',
    'KrossoverMultiselect',
    'Pills',
    'KrossoverTags',
    'ngFileUpload',
    'flow',
    'as.sortable'
]);
