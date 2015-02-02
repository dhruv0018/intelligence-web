/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Highlights page module.
 * @module Highlights
 */
var Highlights = angular.module('Athlete.Profile.Highlights', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Highlights.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/profile/highlights/template.html', require('./template.html'));
    }
]);


/* File dependencies */
require('./controller');
require('./config');
