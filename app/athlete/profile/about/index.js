/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/about/template.html';

const template = require('./template.html');

/**
 * About page module.
 * @module About
 */
const About = angular.module('Athlete.Profile.About', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
About.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);


/* File dependencies */
require('./controller');
require('./config');
