/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Stats page module.
 * @module Stats
 */
var Stats = angular.module('Athlete.Profile.Stats', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
Stats.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/profile/stats/template.html', require('./template.html'));
    }
]);


/* File dependencies */
require('./controller');
require('./config');
