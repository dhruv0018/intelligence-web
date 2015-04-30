/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * About page module.
 * @module About
 */
var About = angular.module('Athlete.Profile.About', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
About.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/profile/about/template.html', require('./template.html'));
    }
]);


/* File dependencies */
require('./controller');
require('./config');
