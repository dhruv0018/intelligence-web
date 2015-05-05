/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/basic-info/template.html';

const template = require('./template.html');

/**
 * BasicInfo page module.
 * @module BasicInfo
 */
const BasicInfo = angular.module('Athlete.Profile.EditProfile.BasicInfo', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
BasicInfo.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/* File dependencies */
require('./controller');
require('./config');
