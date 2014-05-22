/* Fetch angular from the browser scope */
var angular = window.angular;

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
        $templateCache.put('coach/team/all.html', require('./all.html'));
        $templateCache.put('coach/team/active.html', require('./active.html'));
        $templateCache.put('coach/team/inactive.html', require('./inactive.html'));
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
            views: {
                'main@root': {
                    templateUrl: 'coach/team/template.html',
                    controller: 'Coach.Team.controller',
                    resolve: {
                        'Coach.Team.Data': [
                            '$q', 'SessionService', 'TeamsFactory', 'PlayersFactory', 'Coach.Data',
                            function($q, session, teams, players, data) {

                                var teamId = session.currentUser.currentRole.teamId;

                                if (!teamId) return $q.reject(new Error('Could not get current users team'));

                                var team = teams.get(teamId).$promise;

                                var roster = team.then(function(team) {

                                    if (team.roster) {

                                        return players.getList({ roster: team.roster.id }).$promise.then(function(playersList) {

                                            return playersList;

                                        }, function() {

                                            return [];
                                        });
                                    }

                                    else return [];
                                });

                                var rosterId = team.then(function(team) {

                                    if (team.roster) {

                                        return team.roster.id;
                                    }

                                    else {

                                        team.roster = {

                                            teamId: team.id
                                        };

                                        return team.save().then(function() {

                                            return teams.get(teamId).$promise.then(function(team) {

                                                return team.roster.id;
                                            });
                                        });
                                    }
                                });

                                var teamData = {
                                    coachData: data,
                                    team: team,
                                    roster: roster,
                                    rosterId: rosterId
                                };

                                return $q.all(teamData);
                            }
                        ]
                    }
                }
            }
        })

        .state('Coach.Team.All', {
            url: '/all',
            views: {
                'content@Coach.Team': {
                    templateUrl: 'coach/team/all.html',
                    controller: 'Coach.Team.All.controller'
                }
            }
        })

        .state('Coach.Team.Active', {
            url: '/active',
            views: {
                'content@Coach.Team': {
                    templateUrl: 'coach/team/active.html',
                    controller: 'Coach.Team.Active.controller'
                }
            }
        })

        .state('Coach.Team.Inactive', {
            url: '/inactive',
            views: {
                'content@Coach.Team': {
                    templateUrl: 'coach/team/inactive.html',
                    controller: 'Coach.Team.Inactive.controller'
                }
            }
        });
    }
]);

require('./controller');
require('./all-controller');
require('./active-controller');
require('./inactive-controller');
