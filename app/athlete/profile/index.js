/* Component dependencies */
require('highlights');
require('academics');
require('stats');
require('about');
require('edit-profile');

/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/template.html';

const template = require('./template.html');

/**
 * Profile page module.
 * @module Profile
 */
const Profile = angular.module('Athlete.Profile', [
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

        $templateCache.put(templateUrl, template);
    }
]);

/* File dependencies */
require('./config');
require('./controller');
