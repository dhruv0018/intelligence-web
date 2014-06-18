var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.service('SportsStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('SportsFactory', [
    'SportsResource', 'SportsStorage',
    function(SportsResource, SportsStorage) {

        var SportsFactory = {

            storage: SportsStorage,

            resource: SportsResource,

            description: 'sports',

            extendSport: function(sport) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "sport" object. */
                angular.extend(sport, self);

                return sport;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(sport) {

                    return success ? success(sport) : sport;
                };

                error = error || function() {

                    throw new Error('Could not get sport');
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
                        resource = self.extendSport(resource);
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

                var callback = function(sports) {

                    var indexedSports = {};

                    sports.forEach(function(sport) {

                        indexedSports[sport.id] = sport;
                    });

                    sports = index ? indexedSports : sports;

                    return success ? success(sports) : sports;
                };

                error = error || function() {

                    throw new Error('Could not load sports list');
                };

                return self.resource.query(filter, callback, error);
            },

            load: function(filter) {

                var self = this;

                return self.storage.promise || (self.storage.promise = self.getAll(filter));
            },

            save: function(sport) {

                var self = this;

                sport = sport || self;

                if (sport.id) {
                    var updateSport = new SportsResource(sport);
                    return updateSport.$update();

                } else {

                    var newSport = new SportsResource(sport);
                    return newSport.$create();
                }
            }
        };

        return SportsFactory;
    }
]);

