var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('BaseFactory', [
    function() {

        var BaseFactory = {

            extend: function(resource) {

                var self = this;

                angular.extend(resource, self);

                return resource;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(resource) {

                    resource = self.extend(resource);

                    return success ? success(resource) : resource;
                };

                error = error || function() {

                    throw new Error('Could not get ' + self.description);
                };

                return self.resource.get({ id: id }, callback, error);
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

                    throw new Error('Could not load ' + self.description + 's collection');
                };

                var query = self.resource.query(filter, success, error);

                return query.$promise.then(function(resources) {

                    self.storage.list = self.storage.list.concat(resources);

                    resources.forEach(function(resource) {

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

            getList: function(filter, success, error, index) {

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};
                filter.start = filter.start || 0;
                filter.count = filter.count || 1000;

                var callback = function(resources) {

                    var indexedResources = {};

                    resources.forEach(function(resource) {

                        resource = self.extend(resource);

                        indexedResources[resource.id] = resource;
                    });

                    resources = index ? indexedResources : resources;

                    return success ? success(resources) : resources;
                };

                error = error || function() {

                    throw new Error('Could not load ' + self.description + 's list');
                };

                return self.resource.query(filter, callback, error);
            },

            load: function(filter) {

                var self = this;

                return self.getAll(filter);
            },

            save: function(resource, success, error) {

                var self = this;

                resource = resource || self;

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

