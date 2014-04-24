var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TeamsFactory', [
    '$rootScope','ROLES', 'TeamsResource', 'SchoolsResource', 'UsersResource', 'UsersFactory',
    function($rootScope, ROLES, TeamsResource, schools, usersResource, users) {

        var TeamsFactory = {

            resource: TeamsResource,

            extendTeam: function(team) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "team" object. */
                angular.extend(team, self);

                if (!team.roster) {

                    team.roster = {

                        teamId: team.id
                    };

                    return team.save();
                }

                else return team;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(team) {

                    team = self.extendTeam(team);

                    return success ? success(team) : team;
                };

                error = error || function() {

                    throw new Error('Could not get team');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            getList: function(filter, success, error, index) {

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || 1000;

                var callback = function(teams) {

                    var indexedTeams = {};

                    teams.forEach(function(team) {

                        team = self.extendTeam(team);

                        indexedTeams[team.id] = team;
                    });

                    teams = index ? indexedTeams : teams;

                    return success ? success(teams) : teams;
                };

                error = error || function() {

                    throw new Error('Could not load teams list');
                };

                return self.resource.query(filter, callback, error);
            },

            save: function(team, success, error) {

                var self = this;

                team = team || self;

                delete team.league;
                delete team.members;

                if (team.schoolId) delete team.address;

                parameters = {};

                success = success || function(team) {

                    return self.extendTeam(team);
                };

                error = error || function() {

                    throw new Error('Could not save team');
                };

                if (team.id) {

                    var updatedTeam = self.resource.update(parameters, team, success, error);
                    return updatedTeam.$promise;

                } else {

                    var newTeam = self.resource.create(parameters, team, success, error);
                    return newTeam.$promise;
                }
            },

            removeRole: function(role) {

                /* Remove role from team. */
                this.roles.splice(this.roles.indexOf(role), 1);

                /* If removing the head coach role. */
                if (role.userId && users.is(role, ROLES.HEAD_COACH)) {

                    users.get(role.userId, function(user) {

                        /* Check if they are the head coach of any other team,
                         * if not then remove the head coach role for the user. */
                        if (!user.has(ROLES.HEAD_COACH)) {

                            user.removeRole(role);
                        }
                    });
                }
            },

            getMembers: function() {

                var members = [];

                if (this.roles) {

                    for (var i = 0; i < this.roles.length; i++) {

                        var userId = this.roles[i].userId;

                        if (userId) {

                            members[userId] = usersResource.get({ id: userId });
                        }
                    }
                }

                return members;
            },

            getHeadCoachRole: function() {

                if (!this.roles) return undefined;

                /* Filter out all of the head coach roles for the team. */
                var headCoachRoles = this.roles.filter(function(role) {

                    return users.is(role, ROLES.HEAD_COACH);
                });

                /* Filter out all of the head coach roles that are current. */
                var currentHeadCoachRoles = headCoachRoles.filter(function(coach) {

                    return !coach.tenureEnd;
                });

                return currentHeadCoachRoles.pop();
            },

            has: function(match, matchIsCurrent) {

                var self = this;
                var roles = self.roles;

                if (!roles) return false;
                if (!match) throw new Error('No role to match specified');

                /* Check all roles for match. */
                return roles.some(function(role) {

                    /* Optionaly, check if the role is current also. */
                    if (matchIsCurrent === true) {

                        return match.type.id == role.type.id &&
                               role.tenureEnd === null;

                    } else {

                        return match.type.id == role.type.id;
                    }
                });
            }
        };

        return TeamsFactory;
    }
]);

