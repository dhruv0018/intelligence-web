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
    '$q', '$injector', 'Utilities',
    function($q, $injector, util) {

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

                if (!id) {
                    console.error(`parameter 'id' is undefined`);
                    return null;
                }

                var storage = $injector.get(self.storage);

                return storage.get(id);
            },

            /**
             * Gets a list of resource IDs.
             * @param {Array} [list] - a list of resources to map.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @returns {Array.<Number>} - an array of resource IDs.
             */
            getIds: function(list, filter) {

                var self = this;

                if (!filter) filter = list;

                if (!angular.isArray(list)) {

                    /* Get list of resources. */
                    list = self.getList(filter);
                }

                /* Create a map of resource IDs. */
                var ids = list.map(function(resource) {

                    return resource.id;
                });

                return ids;
            },

            /**
             * Gets a list of resources.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @returns {Array.<Resource>} - an array of resources.
             */
            getList: function(filter) {

                let self = this;

                let storage = $injector.get(self.storage);
                let session = $injector.get('SessionService');

                if (!filter) return storage.list;

                let ids;

                if (angular.isArray(filter)) {

                    ids = filter;
                }

                else if (angular.isObject(filter)) {

                    /* Get the view key based on the filter. */
                    let view = session.serializeUserResourceQuery(self.description, filter);

                    ids = storage.loadCachedView(view);
                }

                if (ids) {

                    return storage.list.filter(function(resource) {

                        return ~ids.indexOf(resource.id);
                    });
                }

                // FIXME: Should not return whole list.
                else return storage.list;
            },

            /**
             * Gets a map of resources.
             * @returns {Map.<Number,Resource>} - a map of resources, indexed by ID.
             */
            getMap: function() {

                var self = this;

                var storage = $injector.get(self.storage);

                return storage.map;
            },

            /**
             * Gets a collection of resources.
             * @returns {Map.<Number,Resource>} - a map of resources, indexed by ID.
             */
            getCollection: function() {

                var self = this;

                return self.getMap();
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
            fetch: function(id, success, error, final) {

                let self = this;

                success = success || function(resource) {

                    return resource;
                };

                error = error || function() {

                    throw new Error('Could not fetch ' + self.description.slice(0, -1) + ' ' + id);
                };

                let model = $injector.get(self.model);
                let storage = $injector.get(self.storage);

                /* Make a GET request to the server the resource. */
                let get = model.get({ id: id }, success, error);

                /* Once the get request finishes. */
                let request = get.$promise.then(function(resource) {

                    /* Extend the server resource. */
                    resource = self.extend(resource);

                    /* Store the resource locally in its storage collection. */
                    storage.set(resource);

                    return resource;
                });

                if (final) request.finally(final);

                return request;
            },

            /**
             * Queries resources from the server.
             * @param {Object} [filter] - an object hash of filter parameters.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise.<Array.Resource>} - a promise of an array of resources.
             */
            query: function(filter, success, error, final) {

                let self = this;

                if (angular.isFunction(filter)) {

                    error = success;
                    success = filter;
                    filter = null;
                }

                let session = $injector.get('SessionService');

                let view = session.serializeUserResourceQuery(self.description, filter);

                /* Making a copy of the filter here so that the start and count
                 * properties don't get added to the filter if not passed in as a literal.  */
                filter = angular.copy(filter) || {};

                /* If filtering by an array of IDs. */
                if (filter['id[]']) {

                    /* Clear start and count filters. */
                    filter.start = null;
                    filter.count = null;
                    filter['id[]'] = util.unique(filter['id[]']);
                }

                if (filter.start !== null) filter.start = filter.start || 0;
                if (filter.count !== null) filter.count = filter.count || self.PAGE_SIZE || PAGE_SIZE;

                let aFilterIsUndefined = Object.keys(filter).some(function(key) {

                    if (angular.isArray(filter[key])) return !filter[key].length;
                    else return angular.isUndefined(filter[key]);
                });

                if (aFilterIsUndefined) throw new Error('Undefined filter in ' + self.description + ' ' + JSON.stringify(filter));

                success = success || function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description + ' list');
                };

                let model = $injector.get(self.model);
                let storage = $injector.get(self.storage);

                /* Make a GET request to the server for an array of resources. */
                let query = model.query(filter, success, error);

                /* Once the query request finishes. */
                let request = query.$promise.then(function(resources) {

                    resources.forEach(function(resource) {

                        /* Extend the server resource. */
                        resource = self.extend(resource);

                        /* Store the resource locally in its storage collection. */
                        storage.set(resource);
                    });

                    /* If not filtering by an array of IDs. */
                    if (!filter['id[]']) {

                        var ids = self.getIds(resources);

                        storage.saveView(view, ids);
                    }

                    return resources;
                });

                if (final) request.finally(final);

                return request;
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

                var model = $injector.get(self.model);
                var storage = $injector.get(self.storage);
                var session = $injector.get('SessionService');

                let view = angular.copy(filter) || {};
                delete view.start;
                delete view.count;
                view = session.serializeUserResourceQuery(self.description, view);

                /* Making a copy of the filter here so that the start and count
                 * properties don't get added to the filter if not passed in as a literal.  */
                filter = angular.copy(filter) || {};

                /* If filtering by an array of IDs. */
                if (filter['id[]']) {

                    /* Clear start and count filters. */
                    filter.start = null;
                    filter.count = null;

                    /* Store unique ids. */
                    storage.ids = util.unique(filter['id[]']);

                    /* Batch filter in sets of 100. */
                    filter['id[]'] = storage.ids.splice(0, 100);
                }

                if (filter.start !== null) filter.start = filter.start || 0;
                if (filter.count !== null) filter.count = filter.count || self.PAGE_SIZE || PAGE_SIZE;

                var aFilterIsUndefined = Object.keys(filter).some(function(key) {

                    if (angular.isArray(filter[key])) return !filter[key].length;
                    else return angular.isUndefined(filter[key]);
                });

                if (aFilterIsUndefined) throw new Error('Undefined filter in ' + self.description + ' ' + JSON.stringify(filter));

                success = success || function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description);
                };

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

                    storage.query = storage.query || [];
                    storage.query = storage.query.concat(resources);

                    /* If all of the server resources have been retrieved. */
                    if ((storage.ids && !storage.ids.length) || resources.length < filter.count) {

                        var query = storage.query.slice();

                        /* If not filtering by an array of IDs. */
                        if (!filter['id[]']) {

                            var ids = self.getIds(query);

                            storage.saveView(view, ids);
                        }

                        delete storage.ids;
                        delete storage.query;

                        return query;
                    }

                    /* If there are more resources on the server to retrieve. */
                    else {

                        /* If there are pending IDs. */
                        if (storage.ids && storage.ids.length) {

                            /* Set filter to remaining IDs. */
                            filter['id[]'] = storage.ids;
                        }

                        /* If the start and count filters are both set. */
                        if (angular.isNumber(filter.start) && angular.isNumber(filter.count)) {

                            /* Move the start filter to the next resource set. */
                            filter.start += filter.count;
                        }

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
            load (filter) {

                //TODO: find a less hacky way to do this
                return this.baseLoad(filter);
            },
            baseLoad (filter) {

                var self = this;

                var storage = $injector.get(self.storage);
                var session = $injector.get('SessionService');

                /* Determine the type of filter and return the appropriate response. */
                if (angular.isNumber(filter)) return single(filter);
                else if (angular.isArray(filter)) return multiple(filter);
                else return other(filter);

                /**
                 * Single load. Loads a single resource.
                 * @param {Number} id - an ID of the resource to load.
                 * @return {Promise.<Array>} - a promise of the resource query.
                 */
                function single(id) {

                    /* Attempt to grab the resource from storage. */
                    return storage.grab({ id: id }).then(

                        /* Handle successful cache hit. */
                        function hit(resources) {

                            /* Fetch the resource again to update it. */
                            self.fetch(id);

                            return resources;
                        },

                        /* Handle cache miss. */
                        function miss() {

                            /* Fetch the resource from the server. */
                            return self.fetch(id)

                            .then(function(resource) {

                                /* Convert the return into an array. */
                                return [resource];
                            });
                        }
                    );
                }

                /**
                 * Multiple load. Loads a multiple resources.
                 * @param {Array.<Number>} ids - an array of IDs of the resources to load.
                 * @return {Promise.<Array>} - a promise of the resource query.
                 */
                function multiple(ids) {

                    /* Attempt to grab the resources from storage. */
                    return storage.grab({ id: ids }).then(

                        /* Handle successful cache hit. */
                        function hit(resources) {

                            /* Retrieve the resources again to update them. */
                            self.retrieve({ 'id[]': ids });

                            return resources;
                        },

                        /* Handle cache miss. */
                        function miss() {

                            /* Retrieve the resources from the server. */
                            return self.retrieve({ 'id[]': ids });
                        }
                    );
                }

                /**
                 * Loads resources with a filter.
                 * @param {Object} [filter] - an object hash of filter parameters.
                 * @return {Promise.<Array>} - a promise of the resource query.
                 */
                function other(filter) {

                    /* Get the view key based on the filter. */
                    var view = session.serializeUserResourceQuery(self.description, filter);

                    /* Load the view. */
                    var ids = storage.loadView(view);

                    /* Attempt to grab the resources from storage. */
                    return storage.grab({ id: ids }).then(

                        /* Handle successful cache hit. */
                        function hit(resources) {

                            /* Retrieve the resources again to update them. */
                            self.retrieve(filter);

                            return resources;
                        },

                        /* Handle cache miss. */
                        function miss() {

                            /* Retrieve the resources from the server. */
                            return self.retrieve(filter);
                        }
                    );
                }
            },

            /**
             * Unloads resources.
             * @param {Object} [filter] - an object hash of filter parameters.
             */
            unload: function(filter) {

                var self = this;

                var storage = $injector.get(self.storage);
                var session = $injector.get('SessionService');

                /* Get the view key based on the filter. */
                var view = session.serializeUserResourceQuery(self.description, filter);

                storage.dropView(view);
            },

            /**
             * Saves a resources to the server.
             * @param {Resource} resource - a resource.
             * @param {Function} success - called upon success.
             * @param {Function} error - called on error.
             * @return {Promise.<Resource>} - a promise of a resources.
             */
            save: function(resource, success, error) {
                //TODO: find a less hacky way to do this
                return this.baseSave(resource, success, error);
            },
            baseSave: function(resource, success, error) {

                var self = this;

                resource = resource || self;

                /* Create a copy of the resource to save to the server. */
                var copy = self.unextend(resource);

                resource.isSaving = true;

                var parameters = {};

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

                        delete resource.error;

                        /* Store the resource locally in its storage collection. */
                        storage.set(resource);

                        return resource;
                    })

                    .catch(function() {

                        resource.error = true;
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

                        delete resource.error;

                        /* Store the resource locally in its storage collection. */
                        storage.set(resource);

                        return resource;
                    })

                    .catch(function() {

                        resource.error = true;
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

                resource = resource || self;

                /* Add the deleted flag. */
                resource.isDeleted = true;

                /* If the resource has been saved to the server before. */
                if (resource.id) {

                    /* Save the resource. */
                    resource.save();
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
                delete storage.map[resource.id];

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
