/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/experience/template.html';

const template = require('./template.html');

/**
 * Experience page module.
 * @module Experience
 */
const Experience = angular.module('Athlete.Profile.EditProfile.Experience', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Experience.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/* File dependencies */
require('./controller');
require('./config');
