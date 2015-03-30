/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Physical page module.
 * @module Physical
 */
var Physical = angular.module('Athlete.EditProfile.Physical', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Physical.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/edit-profile/physical/template.html', require('./template.html'));
    }
]);

/* File dependencies */
require('./controller');
require('./config');
