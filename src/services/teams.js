var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TeamsFactory', [
    '$rootScope', 'TeamsResource', 'SchoolsResource',
    function($rootScope, teams, schools) {

        var TeamsFactory = {

            resource: teams,

            list: [],

            getAll: function() {

                var self = this;

                self.list = self.resource.query(function() {

                    for (var i = 0; i < self.list.length; i++) {

                        /* Resolve and append school to team. */
                        var schoolId = self.list[i].schoolId;
                        self.list[i].school = schools.get({ id: schoolId });
                    }
                });

                return self.list;
            },

            save: function(team) {

                var self = this;

                team = team || self;

                if (team.id) self.resource.update(team);
                else self.resource.create(team);
            }
        };

        return TeamsFactory;
    }
]);

