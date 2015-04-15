/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * BasicInfo page module.
 * @module BasicInfo
 */
var BasicInfo = angular.module('Athlete.Profile.EditProfile.BasicInfo', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
BasicInfo.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/edit-profile/basic-info/template.html', require('./template.html'));
    }
]);

/* File dependencies */
require('./controller');
require('./config');
