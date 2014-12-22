var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('Keys', [
    '$injector', 'SessionService',
    function($injector, session) {

        var Keys = {

            get user() {

                session = session || $injector.get('SessionService');

                var key = '@' + session.serializeUserId() + '!';

                return key;
            }
        };

        return Keys;
    }
]);

IntelligenceWebClient.value('Stores.root', Object.create(null));

IntelligenceWebClient.factory('Stores', [
    'Keys', 'Stores.root',
    function(keys, root) {

        var Stores = Object.create(null, {

            user: {

                enumerable: false,

                get: function() {

                    root[keys.user] = root[keys.user] || Object.create(null);

                    return root[keys.user];
                },

                set: function(value) {

                    root[keys.user] = root[keys.user] || Object.create(null);

                    root[keys.user] = value;
                }
            }
        });

        return Stores;
    }
]);

IntelligenceWebClient.factory('BaseStorage', [
    '$q', '$localForage', 'Keys', 'Stores',
    function($q, $localForage, keys, stores) {

        var session;

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

                stores.user[this.description] = stores.user[this.description] || Object.create(null);

                return stores.user[this.description];
            },

            set map(value) {

                stores.user[this.description] = stores.user[this.description] || Object.create(null);

                stores.user[this.description] = value;
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
            },

            update: function() {

                var self = this;

                var list = self.list.map(function(resource) {

                    var copy = angular.copy(resource);
                    var object = self.factory.unextend(copy);
                    var string = angular.toJson(object);

                    return string;
                });

                $localForage.setItem(self.db, list);
            },

            clear: function() {

                this.map = Object.create(null);
                $localForage.removeItem(this.db);
            },

            isStored: function(key) {

                return angular.isDefined(this.map[key]);
            },

            store: function(store, value) {

                var self = this;

                self.set(value);

                var item = self.db;
                if (store) item += '?' + encodeURIComponent(JSON.stringify(store));

                if (angular.isArray(value)) {

                    var list = value.map(function(resource) {

                        var copy = angular.copy(resource);
                        var object = self.factory.unextend(copy);
                        var string = angular.toJson(object);

                        return string;
                    });

                    $localForage.setItem(item, list);
                }

                else if (angular.isObject(value)) {

                    var copy = angular.copy(value);
                    var object = self.factory.unextend(copy);
                    var string = angular.toJson(object);

                    $localForage.setItem(item, string);
                }

                self.update();
            },

            grab: function(store) {

                var self = this;

                var item = self.db;
                if (store) item += '?' + encodeURIComponent(JSON.stringify(store));

                var deferred = $q.defer();

                $localForage.getItem(item).then(function(item) {

                    if (item) {

                        var array = angular.fromJson(item);

                        var resources = array.map(function(string) {

                            var object = angular.fromJson(string);
                            var resource = self.factory.create(object);

                            self.set(resource);

                            return resource;
                        });

                        deferred.resolve(resources);

                    } else {

                        deferred.reject();
                    }
                });

                return deferred.promise;
            }
        };

        Object.defineProperties(BaseStorage, {

            db: {

                enumerable: false,

                get: function() {

                    return keys.user + this.description;
                }
            },

            promises: {

                enumerable: false,

                get: function() {

                    stores.user.promises = stores.user.promises || Object.create(null);

                    return stores.user.promises;
                },

                set: function(value) {

                    stores.user.promises = stores.user.promises || Object.create(null);

                    stores.user.promises = value;
                }
            }
        });

        return BaseStorage;
    }
]);

