var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TeamsFactory', [
    '$rootScope','ROLES', 'TeamsResource', 'SchoolsResource', 'UsersResource', 'UsersFactory',
    function($rootScope, ROLES, TeamsResource, schools, usersResource, users) {

        var TeamsFactory = {

            resource: TeamsResource,

            list: [],

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

                success = success || function() {

                    for (var i = 0; i < self.list.length; i++) {

                        self.list[i] = self.extendTeam(self.list[i]);
                    }
                };

                error = error || function() {

                    throw new Error('Could not load teams list');
                };

                self.list = self.resource.query(filter, success, error);

                return self.list;
            },

            filter: function(filter, success, error) {

                return this.getList(filter, success, error);
            },

            save: function(team) {

                var self = this;

                team = team || self;

                delete team.list;

                if (team.schoolId) delete team.address;

                if (team.id) team.$update();

                else {

                    var newTeam = new TeamsResource(team);
                    newTeam.$create();
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
            }
        };

        return TeamsFactory;
    }
]);

