/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/physical/template.html';

const template = require('./template.html');

/**
 * Physical page module.
 * @module Physical
 */
const Physical = angular.module('Athlete.Profile.EditProfile.Physical', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Physical.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/* File dependencies */
require('./controller');
require('./config');
