var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SchoolsFactory', [
    'SchoolsResource',
    function(SchoolsResource) {

        var SchoolsFactory = {

            resource: SchoolsResource,

            list: [],

            getList: function() {

                var self = this;

                self.list = self.resource.query();

                return self.list;
            },

            save: function(school) {

                var self = this;

                school = school || self;

                delete school.teams;

                if (school.id) {

                    school.$update();

                } else {

                    var newSchool = new SchoolsResource(school);
                    newSchool.$create();
                }
            }
        };

        return SchoolsFactory;
    }
]);

