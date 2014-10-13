var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * Base factory
 * @module IntelligenceWebClient
 * @name BaseFactory
 * @type {factory}
 */
IntelligenceWebClient.factory('BaseFactory', [
    '$q', '$injector', 'ResourceManager',
    function($q, $injector, managedResources) {

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
             * Removes extended properties of the resource.
             * @param {Resource} resource - a user resource object.
             */
            unextend: function(resource) {

                var self = this;

                resource = resource || self;

                /* Create a copy of the resource to break reference to orginal. */
                var copy = angular.copy(resource);

                /* TODO: Remove any properties that should not exist. */

                return copy;
            },

            /**
             * Gets a single resource by ID.
             * @param {Number} id - a resource ID.
             * @returns {Resource} - a resource.
             */
            get: function(id) {

                var self = this;

                if (!self.storage) throw new Error(self.description + ' storage not defined');

                var storage = $injector.get(self.storage);

                var resource;

                /* If given and ID lookup the resource in storage. */
                if (id) {

                    resource = storage.collection[id];
                }

                /* If no ID, then assume the unsaved resource. */
                else {

                    resource = storage.unsaved;
                }

                if (!resource) throw new Error('Could not get ' + self.description.slice(0, -1) + ' ' + id);

                return resource;
            },

            /**
             * Gets a list of resources.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @returns {Array.<Resource>} - an array of resources.
             */
            getList: function(filter) {

                var self = this;

                if (!self.storage) throw new Error(self.description + ' storage not defined');

                var storage = $injector.get(self.storage);

                var key = String(JSON.stringify(filter));

                return storage.loads[key] ? storage.loads[key].list : storage.list;
            },

            /**
             * Gets a collection of resources.
             * @returns {Map.<Number,Resource>} - a map of resources, indexed by ID.
             */
            getCollection: function() {

                var self = this;

                if (!self.storage) throw new Error(self.description + ' storage not defined');

                var storage = $injector.get(self.storage);

                return storage.collection;
            },

            /**
             * Creates a new resource.
             * @return {Resource} - a resource.
             */
            create: function(resource) {

                var self = this;

                resource = resource || {};

                delete resource.id;

                var Model = $injector.get(self.model);

                /* Create new resource instance. */
                resource = new Model(resource);

                /* Extend the server resource. */
                resource = self.extend(resource);

                var storage = $injector.get(self.storage);

                /* Add the resource to storage. */
                storage.unsaved = resource;

                return resource;
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

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                /* Make a GET request to the server the resource. */
                var get = model.get({ id: id }, success, error);

                /* Once the get request finishes. */
                return get.$promise.then(function(resource) {

                    /* Extend the server resource. */
                    resource = self.extend(resource);

                    /* Store the resource locally in its storage collection. */
                    storage.collection[resource.id] = resource;

                    self.updateList();

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
                filter.count = filter.count || self.PAGE_SIZE || PAGE_SIZE;

                var aFilterIsUndefined = Object.keys(filter).some(function(key) {

                    return angular.isUndefined(filter[key]);
                });

                if (aFilterIsUndefined) throw new Error('Undefined filter');

                success = success || function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description + ' list');
                };

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                /* Make a GET request to the server for an array of resources. */
                var query = model.query(filter, success, error);

                /* Once the query request finishes. */
                return query.$promise.then(function(resources) {

                    resources.forEach(function(resource) {

                        /* Extend the server resource. */
                        resource = self.extend(resource);

                        /* Store the resource locally in its storage collection. */
                        storage.collection[resource.id] = resource;
                    });

                    self.updateList();

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
                filter.count = filter.count || self.PAGE_SIZE || PAGE_SIZE;

                var aFilterIsUndefined = Object.keys(filter).some(function(key) {

                    return angular.isUndefined(filter[key]);
                });

                if (aFilterIsUndefined) throw new Error('Undefined filter');

                success = success || function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description);
                };

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                /* Make a GET request to the server for an array of resources. */
                var query = model.query(filter, success, error);

                /* Once the query request finishes. */
                return query.$promise.then(function(resources) {

                    resources.forEach(function(resource) {

                        /* Extend the server resource. */
                        resource = self.extend(resource);

                        /* Store the resource locally in its storage collection. */
                        storage.collection[resource.id] = resource;
                    });

                    storage.query = storage.query || [];
                    storage.query = storage.query.concat(resources);

                    /* If all of the server resources have been retrieved. */
                    if (resources.length < filter.count) {

                        self.updateList();

                        var query = storage.query.slice();
                        delete storage.query;
                        return query;
                    }

                    /* If there are more resources on the server to retrieve. */
                    else {

                        /* Move the start filter to the next resource set. */
                        filter.start += filter.count;

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

                filter = angular.copy(filter);

                var key = String(JSON.stringify(filter));

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                storage.loads = storage.loads || Object.create(null);

                if (!storage.loads[key]) {

                    if (angular.isNumber(filter)) {

                        storage.loads[key] = self.fetch(filter).then(function() {

                            return self;
                        });
                    }

                    else if (angular.isArray(filter)) {

                        filter.filter(function(id) {

                            return !angular.isDefined(self.storage.collection[id]);
                        });

                        if (filter.length) {

                            filter = { 'id[]': filter };

                            self.storage.loads[key] = self.retrieve(filter).then(function(list) {

                                self.storage.loads[key].list = list;

                                return self;
                            });
                        }

                        else {

                            var deferred = $q.defer();

                            self.storage.loads[key] = deferred.promise;
                            self.storage.loads[key].list = [];

                            deferred.resolve(self);
                        }
                    }

                    else {

                        storage.loads[key] = self.retrieve(filter).then(function(list) {

                            storage.loads[key].list = list;

                            return self;
                        });
                    }
                }

                return storage.loads[key];
            },

            /**
             * Unloads resources.
             * @param {Object} [filter] - an object hash of filter parameters.
             */
            unload: function(filter) {

                var self = this;

                var key = String(JSON.stringify(filter));

                var storage = $injector.get(self.storage);

                delete storage.loads[key];
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

                managedResources.reset(resource);

                /* Create a copy of the resource to save to the server. */
                var copy = self.unextend(resource);

                resource.isSaving = true;

                parameters = {};

                success = success || function(resource) {

                    return self.extend(resource);
                };

                error = error || function() {

                    throw new Error('Could not save resource');
                };

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                /* If the resource has been saved to the server before. */
                if (resource.id) {

                    /* Make a PUT request to the server to update the resource. */
                    var update = model.update(parameters, copy, success, error);

                    /* Once the update request finishes. */
                    return update.$promise

                    .then(function() {

                        /* Fetch the updated resource. */
                        return self.fetch(resource.id).then(function(updated) {

                            /* Update local resource with server resource. */
                            angular.extend(resource, self.extend(updated));

                            /* Update the resource in storage. */
                            storage.list[storage.list.indexOf(resource)] = resource;
                            storage.collection[resource.id] = resource;

                            return resource;
                        });
                    })

                    .finally(function() {

                        delete resource.isSaving;
                    });

                /* If the resource is new. */
                } else {

                    /* Make a POST request to the server to create the resource. */
                    var create = model.create(parameters, copy, success, error);

                    /* Once the create request finishes. */
                    return create.$promise

                    .then(function(created) {

                        /* Update local resource with server resource. */
                        angular.extend(resource, self.extend(created));

                        /* Add the resource to storage. */
                        storage.list.push(resource);
                        storage.collection[resource.id] = resource;

                        return resource;
                    })

                    .finally(function() {

                        delete resource.isSaving;
                    });
                }
            },

            /**
             * Removes a resources from the server.
             * @param {Resource} resource - a resource.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise} - a promise.
             */
            remove: function(resource, success, error) {

                var self = this;

                var parameters = {};

                resource = resource || self;

                success = success || angular.noop;

                error = error || function() {

                    throw new Error('Could not remove ' + self.description);
                };

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                /* Remove the resource from storage. */
                storage.list.splice(storage.list.indexOf(resource), 1);
                delete storage.collection[resource.id];

                /* If the resource has been saved to the server before. */
                if (resource.id) {

                    /* Make a DELETE request to the server to delete the resource. */
                    return model.remove(parameters, resource, success, error).$promise;
                }
            },

            updateList: function() {

                var self = this;

                var storage = $injector.get(self.storage);

                /* Clear the storage list. */
                storage.list.length = 0;

                /* Loop through each resource in the storage collection. */
                Object.keys(storage.collection).forEach(function(key) {

                    /* Add the resource to the storage list. */
                    storage.list.push(storage.collection[key]);
                });
            }
        };

        return BaseFactory;
    }
]);

