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
    '$q', '$injector',
    function($q, $injector) {

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

                delete copy.PAGE_SIZE;
                delete copy.description;
                delete copy.model;
                delete copy.storage;

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

                var storage = $injector.get(self.storage);

                return storage.get(id);
            },

            /**
             * Gets a list of resources.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @returns {Array.<Resource>} - an array of resources.
             */
            getList: function(filter) {

                var self = this;

                var storage = $injector.get(self.storage);

                return storage.list;
            },

            /**
             * Gets a collection of resources.
             * @returns {Map.<Number,Resource>} - a map of resources, indexed by ID.
             */
            getCollection: function() {

                var self = this;

                var storage = $injector.get(self.storage);

                return storage.map;
            },

            /**
             * Creates a new resource.
             * @return {Resource} - a resource.
             */
            create: function(resource) {

                var self = this;

                resource = resource || {};

                var Model = $injector.get(self.model);

                /* Create new resource instance. */
                resource = new Model(resource);

                /* Extend the server resource. */
                resource = self.extend(resource);

                var storage = $injector.get(self.storage);

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

                    throw new Error('Could not fetch ' + self.description.slice(0, -1) + ' ' + id);
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
                    storage.set(resource);
                    storage.update();

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
                if (filter.start !== null) filter.start = filter.start || 0;
                if (filter.count !== null) filter.count = filter.count || self.PAGE_SIZE || PAGE_SIZE;

                var aFilterIsUndefined = Object.keys(filter).some(function(key) {

                    if (angular.isArray(filter[key])) return !filter[key].length;
                    else return angular.isUndefined(filter[key]);
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
                        storage.set(resource);
                    });

                    /* Update persistent storage. */
                    storage.update();

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
                if (filter.start !== null) filter.start = filter.start || 0;
                if (filter.count !== null) filter.count = filter.count || self.PAGE_SIZE || PAGE_SIZE;

                var aFilterIsUndefined = Object.keys(filter).some(function(key) {

                    if (angular.isArray(filter[key])) return !filter[key].length;
                    else return angular.isUndefined(filter[key]);
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
                        storage.set(resource);
                    });

                    storage.update();

                    storage.query = storage.query || [];
                    storage.query = storage.query.concat(resources);

                    /* If all of the server resources have been retrieved. */
                    if (resources.length < filter.count) {

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
             * @return {Promise.<Array>} - a promise of the resource query.
             */
            load: function(filter) {

                var self = this;

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);
                var session = $injector.get('SessionService');

                var single = function(id) {

                    if (storage.isStored(id)) {

                        var resource = storage.get(id);

                        var list = [resource];

                        return list;
                    }

                    else return self.fetch(id).then(function(resource) {

                        var list = [resource];

                        return list;
                    });
                };

                var multiple = function(ids) {

                    var promises = [];

                    var numbers = ids.map(function(id) {

                        return Number(id);
                    });

                    var valid = numbers.filter(function(id) {

                        return id > 0 && !isNaN(id);
                    });

                    var unique = valid.reduce(function(previous, current) {

                        if (!~previous.indexOf(current)) previous.push(current);

                        return previous;

                    }, []);

                    var unstored = unique.filter(function(id) {

                        return !storage.isStored(id);
                    });

                    while (unstored.length) {

                        ids = unstored.splice(0, 100);

                        var query = {

                            start: null,
                            count: null,
                            'id[]': ids
                        };

                        promises.push(self.query(query));
                    }

                    return $q.all(promises).then(function() {

                        var list = ids.map(function(id) {

                            return storage.get(id);
                        });

                        return list;
                    });
                };

                var other = function(filter) {

                    return self.retrieve(filter).then(function(list) {

                        return list;
                    });
                };

                var promise = JSON.stringify(filter);

                storage.promises = storage.promises || {};

                storage.promises[promise] = storage.promises[promise] || storage.grab().then(function(resources) {

                    if (angular.isNumber(filter)) single(filter);
                    else if (angular.isArray(filter)) multiple(filter);
                    else other(filter);

                    return resources;

                }, function() {

                    if (angular.isNumber(filter)) return single(filter);
                    else if (angular.isArray(filter)) return multiple(filter);
                    else return other(filter);
                });

                return storage.promises[promise];
            },

            /**
             * Unloads resources.
             */
            unload: function() {

                var self = this;

                filter = filter || '';

                var storage = $injector.get(self.storage);

                storage.clear();
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

                        return resource;
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

                        /* Store the resource locally in its storage collection. */
                        storage.set(resource);

                        return resource;
                    })

                    .finally(function() {

                        delete resource.isSaving;
                    });
                }
            },

            /**
             * Removes a resource from the server.
             * This performs our "soft-delete" by adding a flag to the resource
             * and saving it as "deleted" so it no longer appears.
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

                    throw new Error('Could not remove ' + self.description.slice(0, -1)) + ' ' + resource.id;
                };

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                /* Remove the resource from storage. */
                storage.list.splice(storage.list.indexOf(resource), 1);
                delete storage.collection[resource.id];

                /* If the resource has been saved to the server before. */
                if (resource.id) {

                    /* Add the deleted flag. */
                    resource.isDeleted = true;

                    /* Save the resource. */
                    return model.update(parameters, resource, success, error).$promise;
                }
            },

            /**
             * Deletes a resource from the server.
             * This will send a DELETE request to the server. The resource will
             * be permanently removed locally and remotely.
             * @param {Resource} resource - a resource.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise} - a promise.
             */
            delete: function(resource, success, error) {

                var self = this;

                var parameters = {};

                resource = resource || self;

                success = success || angular.noop;

                error = error || function() {

                    throw new Error('Could not delete ' + self.description.slice(0, -1)) + ' ' + resource.id;
                };

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);

                /* Remove the resource from storage. */
                delete storage.resource[resource.id];

                /* If the resource has been saved to the server before. */
                if (resource.id) {

                    /* Make a DELETE request to the server to delete the resource. */
                    return model.remove(parameters, resource, success, error).$promise;
                }
            }
        };

        return BaseFactory;
    }
]);
