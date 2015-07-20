/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/highlights/template.html';

const template = require('./template.html');

/**
 * Highlights page module.
 * @module Highlights
 */
const Highlights = angular.module('Athlete.Profile.Highlights', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Highlights.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);


/* File dependencies */
require('./controller');
require('./config');
