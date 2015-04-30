/* Component dependencies */
require('highlights');
require('academics');
require('stats');
require('about');
require('edit-profile');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile page module.
 * @module Profile
 */
var Profile = angular.module('Athlete.Profile', [
    'Athlete.Profile.Highlights',
    'Athlete.Profile.Academics',
    'Athlete.Profile.Stats',
    'Athlete.Profile.About',
    'Athlete.Profile.EditProfile',
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
