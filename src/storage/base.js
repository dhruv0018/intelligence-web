var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.value('RootStorage', Object.create(null));

IntelligenceWebClient.factory('BaseStorage', [
    '$injector', '$localForage', 'RootStorage',
    function($injector, $localForage, root) {

        var session;

        var BaseStorage = Object.create({}, {

            db: {

                get: function() {

                    session = session || $injector.get('SessionService');

                    var key = session.serializeUserId() + '$' + session.serializeRole() + '!' + this.description;

                    return key;
                }
            },

            keys: {

                get: function() {

                    var keys = Object.keys(this.resource);

                    return keys;
                }
            },

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
            },

            role: {

                enumerable: false,

                get: function() {

                    session = session || $injector.get('SessionService');

                    var key = session.serializeRole();

                    this.user[key] = this.user[key] || Object.create(null);

                    return this.user[key];
                },

                set: function(value) {

                    session = session || $injector.get('SessionService');

                    var key = session.serializeRole();

                    this.user[key] = this.user[key] || Object.create(null);

                    this.user[key] = value;
                }
            },

            promises: {

                get: function() {

                    var self = this;

                    var promises = this.keys

                    .filter(function(key) {

                        return key.charAt(0) === '@';
                    })

                    .filter(function(key) {

                        return self.resource[key].promise;
                    })

                    .map(function(key) {

                        return self.resource[key].promise;
                    });

                    return promises;
                }
            },

            update: {

                value: function(resource) {

                    session = session || $injector.get('SessionService');

                    var key = '@';

                    var db = this.db + key;

                    this.resource[key] = this.resource[key] || [];

                    if (resource) {

                        var index = this.resource[key]
                        .map(function(resource) { return resource.id; })
                        .indexOf(resource.id);

                        if (~index) this.resource[key][index] = resource;
                        else this.resource[key].push(resource);
                    }

                    else {

                        this.resource[key].length = 0;

                        this.keys.forEach(function(id) {

                            if (String(id).charAt(0) !== key) {

                                this.resource[key].push(this.resource[id]);
                            }

                        }, this);
                    }

                    var list = this.resource[key].map(function(resource) {

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

                    if (this.resource[key]) {

                        var promise = this.resource[key].promise;

                        this.resource[key] = value;
                        this.resource[key].promise = promise;
                    }

                    else {

                        this.resource[key] = value;
                    }

                    if (angular.isArray(value)) {

                        this.update();

                        var list = value.map(function(resource) {

                            return this.get(resource.id);

                        }, this)

                        .map(function(resource) {

                            resource = resource.unextend(resource);
                            resource = angular.toJson(resource);

                            return resource;
                        });

                        $localForage.setItem(db, list);
                    }
                }
            },

            grab: {

                value: function(key, hit, miss) {

                    var self = this;

                    if (!this.isStored(key)) {

                        this.resource[key] = [];

                        var db = this.db + key;

                        this.resource[key].promise = $localForage.getItem(db).then(function(item) {

                            if (item) return hit(item);

                            else return miss();
                        });
                    }

                    return this.resource[key].promise;
                }
            }
        });

        return BaseStorage;
    }
]);

