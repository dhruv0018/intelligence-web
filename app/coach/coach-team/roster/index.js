/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamRoster page module.
 * @module TeamRoster
 */
var TeamRoster = angular.module('coach-team-roster', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamRoster.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/team/roster/template.html', require('./template.html'));
    }
]);

/**
 * TeamRoster page state router.
 * @module TeamRoster
 * @type {UI-Router}
 */
TeamRoster.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider
        .state('Coach.Team.Roster', {
            url: '/roster',
            views: {
                'manager@Coach.Team': {
                    templateUrl: 'coach/team/roster/template.html',
                    controller: 'Coach.Team.Roster.controller'
                }
            }
        });
    }
]);

require('./controller');
