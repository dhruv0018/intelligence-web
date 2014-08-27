var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('SchoolsStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('SchoolsFactory', [
    'SchoolsResource', 'SchoolsStorage', 'BaseFactory', 'ResourceManager', 'SCHOOL_TYPES',
    function(SchoolsResource, SchoolsStorage, BaseFactory, managedResources, SCHOOL_TYPES) {

        var SchoolsFactory = {

            description: 'schools',

            storage: SchoolsStorage,

            resource: SchoolsResource,

            extend: function(school) {
                var self = this;


                //todo hotfixed but we should convert it to a real fix later
                self.type = {
                    id: school.type
                };

                angular.forEach(SCHOOL_TYPES, function(schoolType) {
                    if (schoolType.id === self.type.id) {
                        self.type.name = schoolType.name;
                    }
                });

                angular.extend(school, self);

                return school;
            },
            save: function(resource, success, error) {

                var self = this;

                resource = resource || self;

                managedResources.reset(resource);

                /* Create a copy of the resource to save to the server. */
                var copy = self.unextend(resource);

                //TODO temporary fix
                copy.type = copy.type.id;

                parameters = {};

                success = success || function(resource) {

                    return self.extend(resource);
                };

                error = error || function() {

                    throw new Error('Could not save resource');
                };

                /* If the resource has been saved to the server before. */
                if (resource.id) {

                    /* Make a PUT request to the server to update the resource. */
                    var update = self.resource.update(parameters, copy, success, error);

                    /* Once the update request finishes. */
                    return update.$promise.then(function() {

                        /* Fetch the updated resource. */
                        return self.fetch(resource.id).then(function(updated) {

                            /* Update local resource with server resource. */
                            angular.extend(resource, self.extend(updated));

                            /* Update the resource in storage. */
                            self.storage.list[self.storage.list.indexOf(resource)] = resource;
                            self.storage.collection[resource.id] = resource;

                            return resource;
                        });
                    });

                    /* If the resource is new. */
                } else {

                    /* Make a POST request to the server to create the resource. */
                    var create = self.resource.create(parameters, copy, success, error);

                    /* Once the create request finishes. */
                    return create.$promise.then(function(created) {

                        /* Update local resource with server resource. */
                        angular.extend(resource, self.extend(created));

                        /* Add the resource to storage. */
                        self.storage.list.push(resource);
                        self.storage.collection[resource.id] = resource;

                        return resource;
                    });
                }
            }
        };

        angular.augment(SchoolsFactory, BaseFactory);

        return SchoolsFactory;
    }
]);

