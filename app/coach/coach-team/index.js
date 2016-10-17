/* Fetch angular from the browser scope */
var angular = window.angular;
const CoachTeamTemplateUrl = 'app/coach/coach-team/template.html';

import CoachTeamAssistants from './assistants/index.js';
import CoachTeamRoster from './roster/index.js';

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

/**
 * Coach team data service.
 * @module Team
 * @type {service}
 */
Team.service('Coach.Team.Data.Dependencies', [
    'UsersFactory',
    'PositionsetsFactory',
    'PlayersFactory',
    'TeamsFactory',
    'SessionService',
    '$q',
    function(
        users,
        positionsets,
        players,
        teams,
        session,
        $q
    ) {

        var Data = {

            positionsets: positionsets.load(),

            get users() {

                var userId = session.currentUser.id;

                return users.load({ relatedUserId: userId });
            },

            get teamsAndPlayers() {

                let deferred = $q.defer();
                var user  = session.getCurrentUser();

                teams.load(user.currentRole.teamId).then(function(){
                    var team = teams.get(session.currentUser.currentRole.teamId);

                    return players.load({ rosterId: team.roster.id }).then(function(){deferred.resolve();});
                });

                return deferred.promise;
            }
        };

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
                    'Coach.Team.Data': ['$q','Coach.Team.Data.Dependencies', function($q, data) {
                        return $q.all(data).then(function(data) {
                            return data;
                        });
                    }]
                },
                views: {
                    'main@root': {
                        templateUrl: CoachTeamTemplateUrl
                    }
                }
            });
    }
]);
