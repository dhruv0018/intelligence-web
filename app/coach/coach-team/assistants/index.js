/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamAssistants page module.
 * @module TeamAssistants
 */
var TeamAssistants = angular.module('coach-team-assistants', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamAssistants.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/team/assistants/template.html', require('./template.html'));
    }
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
                    templateUrl: 'coach/team/assistants/template.html',
                    controller: 'Coach.Team.Assistants.controller'
                }
            }
        });
    }
]);

require('./controller');
