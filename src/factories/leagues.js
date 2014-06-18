var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.service('LeaguesStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);


IntelligenceWebClient.factory('LeaguesFactory', [
    'LeaguesResource', 'LeaguesStorage',
    function(LeaguesResource, LeaguesStorage) {

        var LeaguesFactory = {

            resource: LeaguesResource,

            storage: LeaguesStorage,

            description: 'leagues',

            extendLeague: function(league) {

                var self = this;

                /* Copy all of the properties from the retrieved $resource
                 * "league" object. */
                angular.extend(league, self);

                return league;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(league) {

                    return success ? success(league) : league;
                };

                error = error || function() {

                    throw new Error('Could not get league');
                };

                return self.resource.get({ id: id }, callback, error);
            },

            load: function(filter) {

                var self = this;

                return self.storage.promise || (self.storage.promise = self.getAll(filter));
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
                        resource = self.extendLeague(resource);
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

                var callback = function(leagues) {

                    var indexedLeagues = {};

                    leagues.forEach(function(league) {

                        indexedLeagues[league.id] = league;
                    });

                    leagues = index ? indexedLeagues : leagues;

                    return success ? success(leagues) : leagues;
                };

                error = error || function() {

                    throw new Error('Could not load leagues list');
                };

                return self.resource.query(filter, callback, error);
            },

            save: function(league) {
                var self = this;
                league = league || self;

                if (league.id) {
                    var updateLeague = new LeaguesResource(league);
                    return updateLeague.$update();
                } else {
                    var newLeague = new LeaguesResource(league);
                    return newLeague.$create();
                }
            }
        };

        return LeaguesFactory;
    }
]);

