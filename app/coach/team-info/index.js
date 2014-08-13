/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team Info module.
 * @module Team
 */
var TeamInfo = angular.module('Coach.Team.Info', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamInfo.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/team-info/template.html', require('./template.html'));
        $templateCache.put('coach/team-info/information.html', require('./information.html'));
        $templateCache.put('coach/team-info/plans.html', require('./plans-and-packages.html'));
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

            .state('Coach.Team.Info', {
                url: '/team-info',
                views: {
                    'main@root': {
                        templateUrl: 'coach/team-info/template.html',
                        controller: 'Coach.Team.Info.controller'
                    }
                },
                resolve: {
                    'Coach.Data': ['$q', 'Coach.Data.Dependencies', 'SessionService', function($q, data, session) {
                        return $q.all(data).then(function(data) {
                            var teamsCollection = data.teams.getCollection();
                            var team = teamsCollection[session.currentUser.currentRole.teamId];
                            data.team = team;
                            return data;
                        });
                    }]
                }
            })
            .state('Coach.Team.Info.Information', {
                url: '/information',
                views: {
                    'content@Coach.Team.Info': {
                        templateUrl: 'coach/team-info/information.html',
                        controller: 'Coach.Team.Info.Information.controller'
                    }
                }
            })
            .state('Coach.Team.Info.Plans', {
                url: '/information',
                parent: 'Coach.Team.Info',
                views: {
                    'content@Coach.Team.Info': {
                        templateUrl: 'coach/team-info/plans.html',
                        controller: 'Coach.Team.Plans.controller'
                    }
                }
            });
    }
]);

require('./controller');
require('./information-controller');




