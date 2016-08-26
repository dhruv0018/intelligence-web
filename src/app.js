var pkg = require('../package.json');

var templates = require('../build/templates.js');

let host = window.location.host;

if (host === 'new.krossover.com') {

    document.location.assign(`https://app.krossover.com${window.location.pathname}${window.location.search}`);
} else if (host === 'v2-pre-prod.krossover.com') {

    document.location.assign(`https://v2-pre-prod-app.krossover.com${window.location.pathname}${window.location.search}`);
}

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name, [
    'KrossoverBlurOnSelect',
    'ngSanitize',
    'ngResource',
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
    'as.sortable'
]);

IntelligenceWebClient.run(templates.templateCache);
