/* Component dependencies */
require('basic-info');
require('academics');
require('achievements');
require('physical');
require('contact');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Edit Profile page module.
 * @module Edit Profile
 */
var EditProfile = angular.module('Athlete.EditProfile', [
    'Athlete.EditProfile.BasicInfo',
    'Athlete.EditProfile.Academics',
    'Athlete.EditProfile.Achievements',
    'Athlete.EditProfile.Physical',
    'Athlete.EditProfile.Contact',
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
EditProfile.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/edit-profile/template.html', require('./template.html'));
    }
]);

/* File dependencies */
require('./config');
require('./controller');
