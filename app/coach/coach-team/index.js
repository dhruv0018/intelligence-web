/* Fetch angular from the browser scope */
var angular = window.angular;
require('roster');

/**
 * Team page module.
 * @module Team
 */
var Team = angular.module('Coach.Team', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Team.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/team/template.html', require('./template.html'));
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
                'Coach.Data': ['$q','Coach.Data.Dependencies', function($q, data) {
                    return $q.all(data).then(function(data) {
                        return data;
                    });
                }]
            }
        })
        .state('Coach.Team.Assistants', {
            url: '/assistants'
        });
    }
]);
