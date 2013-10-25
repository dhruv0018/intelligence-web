var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SchoolsFactory', [
    'SchoolsResource',
    function(schools) {

        var SchoolsFactory = {

            resource: schools,

            list: [],

            getList: function() {

                var self = this;

                self.list = self.resource.query();

                return self.list;
            },

            save: function(school) {

                var self = this;

                school = school || self;

                if (school.id) self.resource.update(school);
                else self.resource.create(school);
            }
        };

        return SchoolsFactory;
    }
]);

