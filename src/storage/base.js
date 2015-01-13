var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.value('RootStorage', Object.create(null));

IntelligenceWebClient.factory('BaseStorage', [
    '$q', 'Utilities', 'IndexedDB', 'RootStorage',
    function($q, utils, db, root) {

        var BaseStorage = {

            get keys() {

                var keys = Object.keys(this.map);

                return keys;
            },

            get list() {

                var self = this;

                var list = self.keys.map(function(key) {

                    return self.map[key];
                });

                return list;
            },

            get map() {

                root[this.description] = root[this.description] || Object.create(null);

                return root[this.description];
            },

            get: function(key) {

                var id = key;

                if (this.isStored(id)) {

                    var resource = this.map[id];

                    return resource;
                }

                else throw new Error('Could not get ' + this.description.slice(0, -1) + ' ' + id);
            },

            set: function(key, value) {

                var self = this;

                if (!value) {

                    value = key;
                    key = value.id;
                }

                if (angular.isArray(value)) {

                    var list = value.concat();

                    list.forEach(function(item) {

                        self.map[item.id] = item;
                    });
                }

                else if (angular.isObject(value)) {

                    self.map[key] = value;
                }

                db.then(function(db) {

                    var transaction = db.transaction(self.description, 'readwrite');
                    var objectStore = transaction.objectStore(self.description);

                    if (angular.isArray(value)) {

                        var list = value.concat();

                        list.forEach(function(item) {

                            item = self.factory.unextend(item);
                            item = angular.toJson(item);
                            item = angular.fromJson(item);

                            objectStore.put(item);
                        });
                    }

                    else if (angular.isObject(value)) {

                        value = self.factory.unextend(value);
                        value = angular.toJson(value);
                        value = angular.fromJson(value);

                        objectStore.put(value);
                    }
                });
            },

            grab: function(filter) {

                var self = this;
                var request;
                var resources = [];

                return db.then(function(db) {

                    var deferred = $q.defer();

                    var transaction = db.transaction(self.description);
                    var objectStore = transaction.objectStore(self.description);

                    if (filter && angular.isObject(filter) && angular.isDefined(filter.id) && filter.id === null) {

                        deferred.reject();
                    }

                    else if (filter && angular.isObject(filter) && angular.isNumber(filter.id)) {

                        request = objectStore.get(filter.id);

                        request.onsuccess = function(event) {

                            var result = event.target.result;

                            var resource = self.factory.create(result);

                            self.map[resource.id] = resource;

                            resources.push(resource);

                            deferred.resolve(resources);
                        };

                        request.onerror = function(event) {

                            deferred.reject();
                        };
                    }

                    else if (filter && angular.isObject(filter) && angular.isArray(filter.id)) {

                        var promises = [];

                        utils.unique(filter.id).forEach(function(id) {

                            var promise = $q.defer();

                            request = objectStore.get(id);

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

                            promises.push(promise);
                        });

                        $q.all(promises).then(deferred.resolve(resources));
                    }

                    else {

                        request = objectStore.openCursor();

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

                            promise.reject();
                        };
                    }

                    return deferred.promise;
                });
            },

            clear: function() {

                root[this.description] = Object.create(null);

                db.then(function(db) {

                    var transaction = db.transaction(self.description);
                    var objectStore = transaction.objectStore(self.description);

                    objectStore.clear();
                });
            },

            isStored: function(key) {

                return angular.isDefined(this.map[key]);
            },

            saveView: function(key, view) {

                var unique = utils.unique(view);
                var ids = JSON.stringify(unique);

                localStorage.setItem(key, ids);
            },

            loadView: function(key) {

                var item = localStorage.getItem(key);
                var ids = JSON.parse(item);

                return ids;
            },

            dropView: function(key) {

                localStorage.removeItem(key);
            }
        };

        return BaseStorage;
    }
]);

