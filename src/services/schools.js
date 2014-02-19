var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('SchoolsFactory', [
    'SchoolsResource',
    function(SchoolsResource) {

        var SchoolsFactory = {

            resource: SchoolsResource,

            extendSchool: function(school) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "school" object. */
                angular.extend(school, self);

                return school;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(school) {

                    school = self.extendSchool(school);

                    return success ? success(school) : school;
                };

                error = error || function() {

                    throw new Error('Could not get school');
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

                var callback = function(schools) {

                    var indexedSchools = {};

                    schools.forEach(function(school) {

                        school = self.extendSchool(school);

                        indexedSchools[school.id] = school;
                    });

                    schools = index ? indexedSchools : schools;

                    return success ? success(schools) : schools;
                };

                error = error || function() {

                    throw new Error('Could not load schools list');
                };

                return self.resource.query(filter, callback, error);
            },

            save: function(school) {

                var self = this;

                school = school || self;

                delete school.teams;

                if (school.id) {

                    var updateSchool = new SchoolsResource(school);
                    return updateSchool.$update();

                } else {

                    var newSchool = new SchoolsResource(school);
                    return newSchool.$create();
                }
            }
        };

        return SchoolsFactory;
    }
]);

