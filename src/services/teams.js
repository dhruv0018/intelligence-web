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

                return team;
            },

            get: function(teamId, callback) {

                var self = this;

                self.resource.get({ id: teamId }, function(team) {

                    team = self.extendTeam(team);

                    return callback(team);
                });
            },

            getList: function(filter, success, error) {

                var self = this;

                filter = filter || {};

                success = success || function(teams) {

                    return teams.forEach(self.extendTeam, self);
                };

                error = error || function() {

                    throw new Error('Could not load teams list');
                };

                return self.resource.query(filter, success, error);
            },

            filter: function(filter, success, error) {

                return this.getList(filter, success, error);
            },

            save: function(team, success, error) {

                var self = this;

                team = team || self;

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

