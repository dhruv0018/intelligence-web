var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.service('SchoolsStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('SchoolsFactory', [
    'SchoolsResource', 'SchoolsStorage',
    function(SchoolsResource, SchoolsStorage) {

        var SchoolsFactory = {

            resource: SchoolsResource,

            storage: SchoolsStorage,

            description: 'schools',

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

            load: function(filter) {

                var self = this;

                return self.storage.promise || (self.storage.promise = self.getAll(filter));
            },

            getAll: function(filter, success, error) {

                var self = this;

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || PAGE_SIZE;

                success = success || function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description + 's collection');
                };

                var query = self.resource.query(filter, success, error);

                return query.$promise.then(function(resources) {

                    self.storage.list = self.storage.list.concat(resources);

                    resources.forEach(function(resource) {
                        resource = self.extendSchool(resource);
                        self.storage.collection[resource.id] = resource;
                    });

                    if (resources.length < filter.count) {

                        return self.storage.collection;
                    }

                    else {

                        filter.start = filter.start + filter.count + 1;

                        return self.getAll(filter);
                    }
                });
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

