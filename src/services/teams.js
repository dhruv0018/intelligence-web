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

            getAll: function() {

                var self = this;

                self.list = self.resource.query(function() {

                    for (var i = 0; i < self.list.length; i++) {

                        self.list[i] = self.extendTeam(self.list[i]);
                    }
                });

                return self.list;
            },

            save: function(team) {

                var self = this;

                team = team || self;

                delete team.list;

                for (var i = 0; i < team.roles.length; i++) {

                    delete team.roles[i].user;
                }

                if (team.id) team.$update();

                else {

                    var newTeam = new TeamsResource(team);
                    newTeam.$create();
                }
            }
        };

        return TeamsFactory;
    }
]);

