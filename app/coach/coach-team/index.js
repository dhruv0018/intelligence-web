/* Fetch angular from the browser scope */
var angular = window.angular;

require('roster');
require('assistants');

/**
 * Team page module.
 * @module Team
 */
var Team = angular.module('Coach.Team', [
    'ui.router',
    'ui.bootstrap',
    'coach-team-roster',
    'coach-team-assistants'
]);

/* Cache the template file */
Team.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/team/template.html', require('./template.html'));
    }
]);

/**
 * Coach team data service.
 * @module Team
 * @type {service}
 */
Team.service('Coach.Team.Data.Dependencies', [
    'UsersFactory', 'Coach.Data.Dependencies',
    function(users, data) {

        var Data = {

            users: users.load()
        };

        angular.extend(Data, data);

        return Data;
    }
]);

/**
 * Team page state router.
 * @module Team
 * @type {UI-Router}
 */
Team.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('Coach.Team', {
                url: '/team',
                resolve: {
                    'Coach.Team.Data': ['$q','Coach.Data.Dependencies', function($q, data) {
                        return $q.all(data).then(function(data) {
                            return data;
                        });
                    }]
                },
                views: {
                    'main@root': {
                        templateUrl: 'coach/team/template.html'
                    }
                }
            });
    }
]);
