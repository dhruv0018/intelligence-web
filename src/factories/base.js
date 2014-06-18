var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('BaseFactory', [
    '$q',
    function($q) {

        var BaseFactory = {

            extend: function(resource) {

                var self = this;

                angular.extend(resource, self);

                return resource;
            },

            get: function(id) {

                var self = this;

                if (!self.storage) throw new Error(self.description + ' storage not defined');
                if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                return self.storage.collection[id];
            },

            getOne: function(id, success, error) {

                var self = this;

                success = success || function(resource) {

                    return resource;
                };

                error = error || function() {

                    throw new Error('Could not get ' + self.description);
                };

                return self.resource.get({ id: id }, success, error).$promise.then(function(resource) {

                    resource = self.extend(resource);
                    self.storage.collection[resource.id] = resource;

                    var index = self.storage.list.indexOf(resource);

                    if (~index) {

                        self.storage.list[index] = resource;
                    }

                    else {

                        self.storage.list.push(resource);
                    }
                });
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

                    resources.forEach(function(resource) {

                        resource = self.extend(resource);
                        self.storage.collection[resource.id] = resource;
                    });

                    self.storage.list.length = 0;

                    Object.keys(self.storage.collection).forEach(function(key) {

                        self.storage.list.push(self.storage.collection[key]);
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

            getList: function(filter, success, error) {

                var self = this;

                if (arguments.length === 0) {

                    if (!self.storage) throw new Error(self.description + ' storage not defined');
                    if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                    return self.storage.list;
                }

                if (angular.isFunction(filter)) {

                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || PAGE_SIZE;

                success = success ||  function(resources) {

                    return resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description + ' list');
                };

                return self.resource.query(filter, success, error).$promise.then(function(resources) {

                    resources.forEach(function(resource) {

                        resource = self.extend(resource);
                        self.storage.collection[resource.id] = resource;
                    });

                    self.storage.list.length = 0;

                    Object.keys(self.storage.collection).forEach(function(key) {

                        self.storage.list.push(self.storage.collection[key]);
                    });

                    return resources;
                });
            },

            getCollection: function() {

                var self = this;

                if (!self.storage) throw new Error(self.description + ' storage not defined');
                if (!self.storage.collection) throw new Error(self.description + ' not loaded');

                return self.storage.collection;
            },

            load: function(filter) {

                var self = this;

                var deferred = $q.defer();

                self.getAll(filter).then(function() {

                    deferred.resolve(self);
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

                        return self.getOne(resource.id);
                    });

                } else {

                    self.storage.list.push(resource);
                    self.storage.collection[resource.id] = resource;

                    var create = self.resource.create(parameters, resource, success, error);

                    return create.$promise.then(function(resource) {

                        self.storage.list[self.storage.list.indexOf(resource)] = resource;
                        self.storage.collection[resource.id] = resource;
                        return resource;
                    });
                }
            },
        };

        return BaseFactory;
    }
]);

