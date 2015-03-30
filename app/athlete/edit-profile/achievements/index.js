/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Achievements page module.
 * @module Achievements
 */
var Achievements = angular.module('Athlete.EditProfile.Achievements', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Achievements.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/edit-profile/achievements/template.html', require('./template.html'));
    }
]);

/* File dependencies */
require('./controller');
require('./config');
