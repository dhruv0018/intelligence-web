/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile page module.
 * @module Profile
 */
var Profile = angular.module('Athlete.Profile', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Profile.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/profile/template.html', require('./template.html'));
    }
]);


/* File dependencies */
require('./config');
require('./controller');

