var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

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

IntelligenceWebClient.value('RootStore', Object.create(null));

IntelligenceWebClient.factory('Stores', [
    'Keys', 'RootStore',
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

                if (!value) {

                    value = key;
                    key = value.id;
                }

                if (angular.isObject(value)) {

                    this.map[key] = value;
                }

                else if (angular.isArray(value)) {

                    var list = value.concat();

                    list.forEach(function(item) {

                        this.map[key] = item;
                    });
                }
            },

            update: function() {

                var list = this.list.map(function(resource) {

                    resource = resource.unextend(resource);
                    resource = angular.toJson(resource);

                    return resource;
                });

                $localForage.setItem(this.db, list);
            },

            clear: function() {

                this.map = Object.create(null);
                $localForage.removeItem(this.db);
            },

            isStored: function(key) {

                return angular.isDefined(this.map[key]);
            },

            grab: function() {

                var self = this;

                var deferred = $q.defer();

                $localForage.getItem(this.db).then(function(item) {

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
            }
        });

        return BaseStorage;
    }
]);

