var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('RootKey', [
    '$injector', 'SessionService',
    function($injector, session) {

        var RootKey = {

            get key() {

                session = session || $injector.get('SessionService');

                var key = '@' + session.serializeUserId() + '!';

                return key;
            }
        };

        return RootKey.key;
    }
]);

IntelligenceWebClient.value('RootStore', Object.create(null));

IntelligenceWebClient.factory('UserStore', [
    'RootKey', 'RootStore',
    function(key, root) {

        var UserStorage = Object.create(null, {

            user: {

                enumerable: false,

                get: function() {

                    root[key] = root[key] || Object.create(null);

                    return root[key];
                },

                set: function(value) {

                    root[key] = root[key] || Object.create(null);

                    root[key] = value;
                }
            }
        });

        return UserStorage;
    }
]);

IntelligenceWebClient.value('Store', [
    'UserStorage',
    function(user) {

        return user.user;
    }
]);

IntelligenceWebClient.factory('BaseStorage', [
    '$q', '$localForage', 'RootKey', 'Store',
    function($q, $localForage, key, store) {

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

            isStored: function(key) {

                return angular.isDefined(this.map[key]);
            },

            grab: function() {

                var deferred = $q.defer();

                $localForage.getItem(this.db).then(function(item) {

                    if (item) {

                        deferred.resolve(item);

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

                    return key + this.description;
                }
            },

            map: {

                enumerable: false,

                get: function() {

                    store[this.description] = store[this.description] || Object.create(null);

                    return store[this.description];
                },

                set: function(value) {

                    store[this.description] = store[this.description] || Object.create(null);

                    store[this.description] = value;
                }
            }
        });

        return BaseStorage;
    }
]);

