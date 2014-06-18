var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('BaseFactory', [
    '$q'
    function($q) {

        var BaseFactory = {

            extend: function(resource) {

                var self = this;

                angular.extend(resource, self);

                return resource;
            },

            get: function(id) {

                if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                return self.storage.collection[id];
            },

            getList: function() {

                if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                return self.storage.list;
            },

            getCollection: function() {

                if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                return self.storage.collection;
            },

            getAll: function(filter, success, error) {

                var self = this;

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || PAGE_SIZE;

                success = success || function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description);
                };

                var query = self.resource.query(filter, success, error);

                return query.$promise.then(function(resources) {

                    self.storage.list = self.storage.list.concat(resources);

                    resources.forEach(function(resource) {

                        resource = self.extend(resource);
                        self.storage.collection[resource.id] = resource;
                    });

                    if (resources.length < filter.count) {

                        return self.storage.collection;
                    }

                    else {

                        filter.start = filter.start + filter.count + 1;

                        return self.getAll(filter);
                    }
                });
            },

            load: function(filter) {

                var self = this;

                var deferred = $q.defer();

                self.getAll(filter).then(function() {

                    deferred.resolve();
                });

                return deferred.promise;
            },

            save: function(resource, success, error) {

                var self = this;

                resource = resource || self;

                delete resource.description;
                delete resource.resource;
                delete resource.storage;

                parameters = {};

                success = success || function(resource) {

                    return self.extend(resource);
                };

                error = error || function() {

                    throw new Error('Could not save resource');
                };

                if (resource.id) {

                    var update = self.resource.update(parameters, resource, success, error);

                    return update.$promise.then(function() {

                        return self.get(resource.id).$promise.then(function(resource) {

                            self.storage.list[self.storage.list.indexOf(resource)] = resource;
                            self.storage.collection[resource.id] = resource;
                        });
                    });

                } else {

                    self.storage.list.push(resource);
                    self.storage.collection[resource.id] = resource;

                    var create = self.resource.create(parameters, resource, success, error);

                    return create.$promise.then(function(resource) {

                        self.storage.list[self.storage.list.indexOf(resource)] = resource;
                        self.storage.collection[resource.id] = resource;
                    });
                }
            },
        };

        return BaseFactory;
    }
]);

