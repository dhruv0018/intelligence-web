/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module Team
 */
var Team = angular.module('Coach.Team');

/**
 * Coach team page data service.
 * @module Team
 * @type {service}
 */
Team.service('Coach.Team.Data', [
    '$q', 'SessionService', 'TeamsFactory', 'PlayersFactory',
    function($q, session, teams, players) {

        var teamId = session.currentUser.currentRole.teamId;

        if (!teamId) return $q.reject(new Error('Could not get current users team'));

        var team = teams.get(teamId).$promise;

        var roster = team.then(function(team) {

            if (team.roster) {

                return players.getList({ roster: team.roster.id }).$promise;
            }

            else return [];
        });

        var rosterId = team.then(function(team) {

            if (!team.roster) {

                team.roster = {

                    teamId: team.id
                };

                return team.save().then(function(team) {

                    return team.roster.id;
                });
            }

            else return team.roster.id;
        });

        var data = {

            team: team,
            roster: roster,
            rosterId: rosterId
        };

        return $q.all(data);
    }
]);

/**
 * Team controller.
 * @module Team
 * @name Team.controller
 * @type {controller}
 */
Team.controller('Coach.Team.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', '$filter', 'ROLES', 'Coach.Team.Data',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, $filter, ROLES, data) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;

        data.then(function(data) {

            $scope.team = data.team;
            $scope.roster = data.roster;
            $scope.rosterId = data.rosterId;
        });

        $scope.state = $state.current.name;

        $scope.$watch('state', function(state) {

            if (state) $state.go(state);
        });
    }
]);

