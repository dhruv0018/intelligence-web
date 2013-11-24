var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SchoolsFactory', [
    'SchoolsResource',
    function(SchoolsResource) {

        var SchoolsFactory = {

            resource: SchoolsResource,

            list: [],
            get: function(id, callback) {
                var self = this;
                self.resource.get({ id: id }, function(school){
                    return callback(school);
                });
            },

            getList: function(filter, success, error) {

                var self = this;
                filter = filter || {};
                error = error || function() {
                    throw new Error('Could not load leagues list');
                };

                return self.resource.query(filter, function(results){
                    return success ? success(results) : results;
                }, error);
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

