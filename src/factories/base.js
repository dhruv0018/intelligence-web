var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

/**
 * Base factory
 * @module IntelligenceWebClient
 * @name BaseFactory
 * @type {factory}
 */
IntelligenceWebClient.factory('BaseFactory', [
    '$q',
    function($q) {

        var BaseFactory = {

            /**
             * Extends resource with all of the properties from its factory.
             * @param {Resource} resource - a user resource object.
             */
            extend: function(resource) {

                var self = this;

                angular.extend(resource, self);

                return resource;
            },

            /**
             * Gets a single resource by ID.
             * @param {Number} id - a resource ID.
             * @returns {Resource} - a resource.
             */
            get: function(id) {

                var self = this;

                if (!self.storage) throw new Error(self.description + ' storage not defined');
                if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                return self.storage.collection[id];
            },

            /**
             * Gets a list of resources.
             * @returns {Array.<Resource>} - an array of resources.
             */
            getList: function() {

                var self = this;

                if (!self.storage) throw new Error(self.description + ' storage not defined');
                if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                return self.storage.list;
            },

            /**
             * Gets a collection of resources.
             * @returns {Map.<Number,Resource>} - a map of resources, indexed by ID.
             */
            getCollection: function() {

                var self = this;

                if (!self.storage) throw new Error(self.description + ' storage not defined');
                if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                return self.storage.collection;
            },

            /**
             * Fetches a single resource from the server.
             * @param {Number} id - a resource ID.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise.<Resource>} - a promise of a resource.
             */
            fetch: function(id, success, error) {

                var self = this;

                success = success || function(resource) {

                    return resource;
                };

                error = error || function() {

                    throw new Error('Could not get ' + self.description);
                };

                /* Make a GET request to the server the resource. */
                var get = self.resource.get({ id: id }, success, error);

                /* Once the get request finishes. */
                return get.$promise.then(function(resource) {

                    /* Extend the server resource. */
                    resource = self.extend(resource);

                    /* Store the resource locally in its storage collection. */
                    self.storage.collection[resource.id] = resource;

                    /* Clear the storage list. */
                    self.storage.list.length = 0;

                    /* Loop through each resource in the storage collection. */
                    Object.keys(self.storage.collection).forEach(function(key) {

                        /* Add the resource to the storage list. */
                        self.storage.list.push(self.storage.collection[key]);
                    });

                    return resource;
                });
            },

            /**
             * Queries resources from the server.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise.<Array.Resource>} - a promise of an array of resources.
             */
            query: function(filter, success, error) {

                var self = this;

                if (angular.isFunction(filter)) {

                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || PAGE_SIZE;

                success = success ||  function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description + ' list');
                };

                /* Make a GET request to the server for an array of resources. */
                var query = self.resource.query(filter, success, error);

                /* Once the query request finishes. */
                return query.$promise.then(function(resources) {

                    resources.forEach(function(resource) {

                        /* Extend the server resource. */
                        resource = self.extend(resource);

                        /* Store the resource locally in its storage collection. */
                        self.storage.collection[resource.id] = resource;
                    });

                    /* Clear the storage list. */
                    self.storage.list.length = 0;

                    /* Loop through each resource in the storage collection. */
                    Object.keys(self.storage.collection).forEach(function(key) {

                        /* Add the resource to the storage list. */
                        self.storage.list.push(self.storage.collection[key]);
                    });

                    return resources;
                });
            },

            /**
             * Retrieves all resources from the server.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise.<Map.<Number,Resource>>} - a promise of a map of resources.
             */
            retrieve: function(filter, success, error) {

                var self = this;

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || PAGE_SIZE;

                success = success || function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description);
                };

                /* Make a GET request to the server for an array of resources. */
                var query = self.resource.query(filter, success, error);

                /* Once the query request finishes. */
                return query.$promise.then(function(resources) {

                    resources.forEach(function(resource) {

                        /* Extend the server resource. */
                        resource = self.extend(resource);

                        /* Store the resource locally in its storage collection. */
                        self.storage.collection[resource.id] = resource;
                    });

                    /* Clear the storage list. */
                    self.storage.list.length = 0;

                    /* Loop through each resource in the storage collection. */
                    Object.keys(self.storage.collection).forEach(function(key) {

                        /* Add the resource to the storage list. */
                        self.storage.list.push(self.storage.collection[key]);
                    });

                    /* If all of the server resources have been retrieved. */
                    if (resources.length < filter.count) {

                        return self.storage.collection;
                    }

                    /* If there are more resources on the server to retrieve. */
                    else {

                        /* Move the start filter to the next resource set. */
                        filter.start = filter.start + filter.count + 1;

                        /* Keep retrieving resources until all are retrieved. */
                        return self.retrieve(filter);
                    }
                });
            },

            /**
             * Loads all resources from the server.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @return {Promise.<self>} - a promise of the resource factory.
             */
            load: function(filter) {

                var self = this;

                var deferred = $q.defer();

                /* Retrieve all of the resources from the server. */
                self.retrieve(filter).then(function() {

                    deferred.resolve(self);
                });

                return deferred.promise;
            },

            /**
             * Saves a resources to the server.
             * @param {Resource} resource - a resource.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise.<Resource>} - a promise of a resources.
             */
            save: function(resource, success, error) {

                var self = this;

                resource = resource || self;

                delete resource.description;
                delete resource.resource;
                delete resource.storage;

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
                    var update = self.resource.update(parameters, resource, success, error);

                    /* Once the update request finishes. */
                    return update.$promise.then(function() {

                        /* Fetch the updated resource. */
                        return self.fetch(resource.id);
                    });

                /* If the resource is new. */
                } else {

                    /* Immediately add the resource to storage. */
                    self.storage.list.push(resource);
                    self.storage.collection[resource.id] = resource;

                    /* Make a POST request to the server to create the resource. */
                    var create = self.resource.create(parameters, resource, success, error);

                    /* Once the create request finishes. */
                    return create.$promise.then(function(resource) {

                        /* Update the resource in storage. */
                        self.storage.list[self.storage.list.indexOf(resource)] = resource;
                        self.storage.collection[resource.id] = resource;

                        return resource;
                    });
                }
            },
        };

        return BaseFactory;
    }
]);

