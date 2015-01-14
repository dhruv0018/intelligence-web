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
             * @param {Object} filter - filter for querying storage.
             * @returns {Promise.<Array>.<Resource>} - an array of resources.
             */
            grab: function(filter) {

                var self = this;
                var resources = [];
                var transaction;
                var objectStore;

                /* After the database connection is opened. */
                return db.then(function(db) {

                    /* Create a read transaction. */
                    transaction = db.transaction(self.description);

                    /* Get the object storage based on description. */
                    objectStore = transaction.objectStore(self.description);

                    if (filter && angular.isObject(filter) && angular.isDefined(filter.id) && filter.id === null) {

                        var deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    }

                    else if (filter && angular.isObject(filter) && angular.isNumber(filter.id)) {

                        var id = filter.id;

                        return getOne(id);
                    }

                    else if (filter && angular.isObject(filter) && angular.isArray(filter.id)) {

                        var promises = [];

                        var ids = utils.unique(filter.id);

                        ids.forEach(function(id) {

                            promises.push(getOne(id));
                        });

                        return $q.all(promises);
                    }

                    else {

                        return getAll();
                    }
                });

                function getOne(id) {

                    var promise = $q.defer();

                    if (self.isStored(id)) {

                        var resource = self.get(id);

                        promise.resolve(resource);
                    }

                    else {

                        var request = objectStore.get(id);

                        request.onsuccess = function(event) {

                            var result = event.target.result;

                            var resource = self.factory.create(result);

                            self.map[resource.id] = resource;

                            resources.push(resource);

                            promise.resolve(resources);
                        };

                        request.onerror = function(event) {

                            promise.reject();
                        };
                    }

                    return promise.promise;
                }

                function getAll() {

                    var request = objectStore.openCursor();

                    request.onsuccess = function(event) {

                        var result = event.target.result;

                        if (result) {

                            var resource = self.factory.create(result);

                            self.map[resource.id] = resource;

                            resources.push(resource);

                            result.continue();
                        }

                        else deferred.resolve(resources);
                    };

                    request.onerror = function(event) {

                        deferred.reject();
                    };
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

