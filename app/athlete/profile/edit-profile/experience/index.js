/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Experience page module.
 * @module Experience
 */
var Experience = angular.module('Athlete.Profile.EditProfile.Experience', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Experience.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/edit-profile/experience/template.html', require('./template.html'));
    }
]);

/* File dependencies */
require('./controller');
require('./config');
