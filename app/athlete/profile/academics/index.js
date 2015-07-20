/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/academics/template.html';

const template = require('./template.html');

/**
 * Academics page module.
 * @module Academics
 */
const Academics = angular.module('Athlete.Profile.Academics', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Academics.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);


/* File dependencies */
require('./controller');
require('./config');
