/* Fetch angular from the browser scope */
var angular = window.angular;
const CoachTeamRosterTemplateUrl = 'app/coach/coach-team/roster/template.html';
import CoachTeamRosterController from './controller';

/**
 * TeamRoster page module.
 * @module TeamRoster
 */
var TeamRoster = angular.module('coach-team-roster', [
    'ui.router',
    'ui.bootstrap'
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
                    templateUrl: CoachTeamRosterTemplateUrl,
                    controller: CoachTeamRosterController
                }
            }
        });
    }
]);
