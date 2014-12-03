var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.value('RootStore', Object.create(null));

IntelligenceWebClient.factory('UserStore', [
    '$injector', 'SessionService', 'RootStore',
    function($injector, session, root) {

        var UserStorage = Object.create(null, {

            user: {

                enumerable: false,

                get: function() {

                    session = session || $injector.get('SessionService');

                    var user = session.currentUser;

                    root[user.id] = root[user.id] || Object.create(null);

                    return root[user.id];
                },

                set: function(value) {

                    session = session || $injector.get('SessionService');

                    var user = session.currentUser;

                    root[user.id] = root[user.id] || Object.create(null);

                    root[user.id] = value;
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
    '$injector', '$localForage', 'Store',
    function($injector, $localForage, store) {

        var session;

        var BaseStorage = Object.create(Object.prototype, {

            db: {

                get: function() {

                    session = session || $injector.get('SessionService');

                    var key = session.serializeUserId() + '$' + session.serializeRole() + '!' + this.description;

                    return key;
                }
            },

            all: {

                get: function() {

                    return this.resource;
                }
            },

            keys: {

                get: function() {

                    var keys = Object.keys(this.resource);

                    return keys;
                }
            },

            list: {

                get: function() {

                    var self = this;

                    var list = self.keys.map(function(key) {

                        return self.resource[key];
                    });

                    return list;
                }
            },

            resource: {

                enumerable: false,

                get: function() {

                    store[this.description] = store[this.description] || Object.create(null);

                    return store[this.description];
                },

                set: function(value) {

                    store[this.description] = store[this.description] || Object.create(null);

                    store[this.description] = value;
                }
            },

            update: {

                value: function(resource) {

                    var key = '@';

                    var db = this.db + key;

                    var list = this.list.map(function(resource) {

                        resource = resource.unextend(resource);
                        resource = angular.toJson(resource);

                        return resource;
                    });

                    $localForage.setItem(db, list);
                }
            },

            isStored: {

                value: function(key) {

                    return angular.isDefined(this.resource[key]);
                }
            },

            get: {

                value: function(key) {

                    if (!key) return this.resource;

                    if (!this.isStored(key)) {

                        if (String(key).charAt(0) === '@') throw new Error('Could not get ' + this.description.slice(0, -1) + ' list ' + key);
                        throw new Error('Could not get ' + this.description.slice(0, -1) + ' ' + key);
                    }

                    return this.resource[key];
                }
            },

            set: {

                value: function(key, value) {

                    if (!value) {

                        value = key;
                        key = value.id;
                    }

                    session = session || $injector.get('SessionService');

                    var db = this.db + key;

                    if (angular.isArray(value)) {

                        value = value.concat();
                    }

                    this.resource[key] = value;
                }
            },

            grab: {

                value: function(key, hit, miss) {

                    var db = this.db + key;

                    return $localForage.getItem(db).then(function(item) {

                        if (item) return hit(item);

                        else return miss();
                    });
                }
            }
        });

        return BaseStorage;
    }
]);

