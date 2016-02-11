var pkg = require('../package.json');

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
