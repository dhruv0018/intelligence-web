/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team Info module.
 * @module Team
 */
var TeamInfo = angular.module('Coach.TeamInfo', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamInfo.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/team-info/template.html', require('./template.html'));
    }
]);

/**
 * Team page state router.
 * @module Team
 * @type {UI-Router}
 */
TeamInfo.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('Coach.TeamInfo', {
                url: '/team-info',
                views: {
                    'main@root': {
                        templateUrl: 'coach/team-info/template.html',
                        controller: 'Coach.TeamInfo.controller'
                    }
                }
            });
    }
]);

require('./controller');




