/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Contact page module.
 * @module Contact
 */
var Contact = angular.module('Athlete.EditProfile.Contact', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Contact.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/edit-profile/contact/template.html', require('./template.html'));
    }
]);


/* File dependencies */
require('./controller');
require('./config');
