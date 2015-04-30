var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * Root storage
 * Root level container for all storage.
 * @module IntelligenceWebClient
 * @name RootStorage
 * @type {value}
 */
IntelligenceWebClient.value('RootStorage', Object.create(null));

/**
 * Base storage
 * Base level factory for all storage.
 * @module IntelligenceWebClient
 * @name BaseStorage
 * @type {factory}
 */
IntelligenceWebClient.factory('BaseStorage', [
    '$q', 'Utilities', 'IndexedDB', 'RootStorage',
    function($q, utils, db, root) {

        var BaseStorage = {

            /**
             * A map of resources.
             * Stores resources in the root storage segregated by their
             * description.
             * @property {Map.<Resource>} - a map of resources.
             */
            get map() {

                /* Use the existing resources map. Or create a new resource map
                 * if one does not exist. */
                root[this.description] = root[this.description] || Object.create(null);

                return root[this.description];
            },

            /**
             * A list of resource keys.
             * Lists all of the resources in the map by their keys.
             * @property {Array.<Number|String>} - a list of keys.
             */
            get keys() {

                /* Get all of the keys in the map. */
                var keys = Object.keys(this.map);

                return keys;
            },

            /**
             * A list of resources.
             * Lists all of the resources in the map.
             * @property {Array.<Resource>} - a list of resources.
             */
            get list() {

                var self = this;

                /* Create the list of resources by mapping the resource keys to
                 * their entries in the map. */
                var list = self.keys.map(function(key) {

                    /* Get the resource entry in the map by key. */
                    return self.map[key];
                });

                return list;
            },

            /**
             * Gets a resource.
             * @param {Number|String} key - a key, used to lookup the resource.
             * @returns {Resource} - a resource.
             */
            get: function(key) {

                /* Get the resource entry in the map by key, if the resource
                 * exists in the map, return its value. */
                if (this.map[key]) return this.map[key];

                /* If the resource does not exist in the map, throw an error. */
                else throw new Error('Could not get ' + this.description.slice(0, -1) + ' ' + key);
            },

            /**
             * Sets a resource.
             * Sets the resource in both memory and the database.
             * @param {Number|String} key - a key, used to store the resource.
             * @param {Resource} value - a resource.
             */
            set: function(key, value) {

                var self = this;

                /* If no value argument is given, assume the key is the value
                 * and use its ID property as the key. */
                if (!value) {

                    value = key;
                    key = value.id;
                }

                /* Set the resource in memory. */
                self.ram(key, value);

                /* Set the resource in the database. */
                self.put(value);
            },

            /**
             * Sets a resource.
             * Sets the resource in memory.
             * @param {Number|String} key - a key, used to store the resource.
             * @param {Resource} value - a resource.
             */
            ram: function(key, value) {

                var self = this;

                /* If no value argument is given, assume the key is the value
                 * and use its ID property as the key. */
                if (!value) {

                    value = key;
                    key = value.id;
                }

                /* If the value is an array. */
                if (angular.isArray(value)) {

                    /* For each item given. */
                    value.forEach(function(item) {

                        /* Set the item entry in the map by its ID. */
                        self.map[item.id] = item;
                    });
                }

                /* If the value is an object. */
                else if (angular.isObject(value)) {

                    /* Set the entry in the map by key. */
                    self.map[key] = value;
                }
            },

            /**
             * Puts a resource.
             * Puts the resource in the database.
             * @param {Resource} value - a resource.
             */
            put: function(value) {

                var self = this;

                /* After the database connection is opened. */
                db.then(function(db) {

                    /* Create a read/write transaction. */
                    var transaction = db.transaction(self.description, 'readwrite');

                    /* Get the object storage based on description. */
                    var objectStore = transaction.objectStore(self.description);

                    /* If the value is an array. */
                    if (angular.isArray(value)) {

                        /* For each item given. */
                        value.forEach(function(item) {

                            /* Convert the resource into a storable object. */
                            item = self.factory.unextend(item);
                            item = angular.toJson(item);
                            item = angular.fromJson(item);

                            /* Update the entry in the object store. */
                            objectStore.put(item);
                        });
                    }

                    /* If the value is an object. */
                    else if (angular.isObject(value)) {

                        /* Convert the resource into a storable object. */
                        value = self.factory.unextend(value);
                        value = angular.toJson(value);
                        value = angular.fromJson(value);

                        /* Update the entry in the object store. */
                        objectStore.put(value);
                    }
                });
            },

            /**
             * Grab resources in storage.
             * Grabs resources by first looking for them in memory, if not there
             * then looking in the database. Results can be filtered by an ID or
             * an array of IDs. If no filter is provided all resources in the
             * database are returned.
             * @param {Object} filter - filter for querying storage.
             * @returns {Promise.<Array>.<Resource>} - an array of resources.
             */
            grab: function(filter) {

                var self = this;
                var transaction;
                var objectStore;

                /* After the database connection is opened. */
                return db.then(function(db) {

                    /* Create a read transaction. */
                    transaction = db.transaction(self.description);

                    /* Get the object storage based on description. */
                    objectStore = transaction.objectStore(self.description);

                    /* If the ID filter is null. */
                    if (filter && angular.isObject(filter) && angular.isDefined(filter.id) && filter.id === null) {

                        /* Reject the promise. */
                        return $q.reject();
                    }

                    /* If the ID filter is a number. */
                    else if (filter && angular.isObject(filter) && angular.isNumber(filter.id)) {

                        /* Use the ID in the filter for lookup. */
                        var id = filter.id;

                        /* Return the promise of one resource. */
                        return getOne(id);
                    }

                    /* If the ID filter is an array. */
                    else if (filter && angular.isObject(filter) && angular.isArray(filter.id)) {

                        var promises = [];   // The promises for each resource.
                        var resources = [];  // The list of resources to return.

                        /* Use the unique IDs in the filter for lookup. */
                        var ids = utils.unique(filter.id);

                        /* For each ID. */
                        ids.forEach(function(id) {

                            /* Hold onto the promise of getting one resource. */
                            var promise = getOne(id)

                            /* After successfully getting the resource. */
                            .then(function(resource) {

                                /* Add that resource to the list of resources. */
                                resources.push(resource);
                            });

                            /* Add the promise to the others. */
                            promises.push(promise);
                        });

                        /* Wait for all of the promises to complete. */
                        return $q.all(promises)

                        /* After successfully getting all of the resource. */
                        .then(function() {

                            /* Return list of all resources. */
                            return resources;
                        });
                    }

                    /* Otherwise; if no filters match. */
                    else {

                        /* Return all of the resources. */
                        return getAll();
                    }
                });

                /**
                 * Get one resource in storage.
                 * @param {Number} id - the resource ID to lookup.
                 * @returns {Promise.<Resource>} - a resource.
                 */
                function getOne(id) {

                    /* Create a promise. */
                    var promise = $q.defer();

                    /* If the resource is stored in memory already. */
                    if (self.isStored(id)) {

                        /* Get the resource. */
                        var resource = self.get(id);

                        /* Resolve the promise with the resource from memory. */
                        promise.resolve(resource);
                    }

                    /* If the resource is not stored in memory already, look in
                     * the database for it. */
                    else {

                        /* Create a request to the object store for the resource
                         * with the given ID. */
                        var request = objectStore.get(id);

                        /* If the request is successful. */
                        request.onsuccess = function(event) {

                            /* Get the result of the request. */
                            var result = event.target.result;

                            /* If there is a value in the result. */
                            if (result) {

                                /* Use the relevant factory to create a resource. */
                                var resource = self.factory.create(result);

                                /* Set the resource in memory. */
                                self.ram(resource);

                                /* Resolve the promise with the database resource. */
                                promise.resolve(resource);
                            }

                            /* If there is no value in the result; reject the promise. */
                            else promise.reject();
                        };

                        /* If there is an error with the request. */
                        request.onerror = function(event) {

                            promise.reject();
                        };
                    }

                    return promise.promise;
                }

                /**
                 * Get all resources in storage.
                 * @returns {Promise.<Array>.<Resource>} - an array of resources.
                 */
                function getAll() {

                    /* Create a promise. */
                    var promise = $q.defer();

                    var resources = [];  // The list of resources to return.

                    /* Create a request to the object store for a cursor. */
                    var request = objectStore.openCursor();

                    /* If the request is successful. */
                    request.onsuccess = function(event) {

                        /* Get the result of the request. */
                        var result = event.target.result;

                        /* If there is a result, the cursor has found data. */
                        if (result) {

                            /* Use the relevant factory to create a resource. */
                            var resource = self.factory.create(result);

                            /* Set the resource in memory. */
                            self.ram(resource);

                            /* Add that resource to the list of resources. */
                            resources.push(resource);

                            /* Continue the cursor looking for more results. */
                            result.continue();
                        }

                        /* If there are no more results, then the cursor is
                         * finished. Resolve the promise with all of the
                         * resources in th cursor. */
                        else promise.resolve(resources);
                    };

                    /* If there is an error with the request. */
                    request.onerror = function(event) {

                        promise.reject();
                    };

                    return promise.promise;
                }
            },

            /**
             * Clears storage.
             * Clears all data from memory and the database.
             */
            clear: function() {

                /* Clear data in memory by reassigning to a new map. */
                root[this.description] = Object.create(null);

                /* After the database connection is opened. */
                db.then(function(db) {

                    /* Create a new transaction. */
                    var transaction = db.transaction(self.description);

                    /* Get the object storage based on description. */
                    var objectStore = transaction.objectStore(self.description);

                    /* Clear the object store. */
                    objectStore.clear();
                });
            },

            /**
             * Checks if a resource is stored.
             * @param {Number|String} key - a key, used to lookup the resource.
             * @returns {Boolean} - true if the resource is stored.
             */
            isStored: function(key) {

                /* Check if the resource is defined in the map at the given key. */
                return angular.isDefined(this.map[key]);
            },

            /**
             * Saves a view.
             * Saves a view (a list of IDs) which corresponds to the given key
             * @param {Number|String} key - a key, used to store the view.
             * @param {Array.<Number|String>} view - a list of resource keys.
             */
            saveView: function(key, view) {

                /* Ensure all of the IDs in the view are unique. */
                var unique = utils.unique(view);

                /* Convert the array into a JSON string. */
                var ids = JSON.stringify(unique);

                /* Save the JSON string of IDs in local storage. */
                localStorage.setItem(key, ids);
            },

            /**
             * Loads a view.
             * Loads a view (a list of IDs) which corresponds to the given key
             * @param {Number|String} key - a key, used to lookup the view.
             * @returns {Array.<Number|String>} a list of resource keys.
             */
            loadView: function(key) {

                /* Load a JSON string of IDs from local storage. */
                var item = localStorage.getItem(key);

                /* Parse the JSON string. */
                var ids = JSON.parse(item);

                /* Return array of IDs. */
                return ids;
            },

            /**
             * Loads a cached view.
             * Loads a view (a list of IDs) which corresponds to the given key,
             * but throws if the key was not stored before.
             * @param {Number|String} key - a key, used to lookup the view.
             * @returns {Array.<Number|String>} a list of resource keys.
             */
            loadCachedView: function(key) {

                let ids = this.loadView(key);

                // FIXME: This should throw the error
                //if (ids === null) throw new Error(`View '${key}' not cached yet in local Storage.`);
                if (ids === null) console.error(new Error(`View '${key}' not cached yet in local Storage.`));

                /* Return array of IDs. */
                return ids;
            },

            /**
             * Drops a view.
             * Drops a view (a list of IDs) which corresponds to the given key
             * @param {Number|String} key - a key, used to identify the view.
             */
            dropView: function(key) {

                /* Remove the view from local storage. */
                localStorage.removeItem(key);
            }
        };

        return BaseStorage;
    }
]);
