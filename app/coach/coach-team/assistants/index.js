/* Fetch angular from the browser scope */
var angular = window.angular;
const CoachTeamAssistantsTemplateUrl = 'app/coach/coach-team/assistants/template.html';

import CoachTeamAssistantsController from './controller';
/**
 * TeamAssistants page module.
 * @module TeamAssistants
 */
var TeamAssistants = angular.module('coach-team-assistants', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * TeamAssistants page state router.
 * @module Team
 * @type {UI-Router}
 */
TeamAssistants.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider
        .state('Coach.Team.Assistants', {
            url: '/assistants',
            views: {
                'manager@Coach.Team': {
                    templateUrl: CoachTeamAssistantsTemplateUrl,
                    controller: CoachTeamAssistantsController
                }
            }
        });
    }
]);
