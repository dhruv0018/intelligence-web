/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/stats/template.html';

const template = require('./template.html');

/**
 * Stats page module.
 * @module Stats
 */
const Stats = angular.module('Athlete.Profile.Stats', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Stats.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);


/* File dependencies */
require('./controller');
require('./config');
