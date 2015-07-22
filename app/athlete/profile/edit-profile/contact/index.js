/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/contact/template.html';

const template = require('./template.html');

/**
 * Contact page module.
 * @module Contact
 */
const Contact = angular.module('Athlete.Profile.EditProfile.Contact', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Contact.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/* File dependencies */
require('./controller');
require('./config');
