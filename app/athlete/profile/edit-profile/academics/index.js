/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Academics page module.
 * @module Academics
 */
var Academics = angular.module('Athlete.Profile.EditProfile.Academics', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Academics.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/edit-profile/academics/template.html', require('./template.html'));
    }
]);

/* File dependencies */
require('./controller');
require('./config');
