var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.service('PlansStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('PlansFactory', [
    'PlansResource', 'PlansStorage',
    function(PlansResource, PlansStorage) {

        var PlansFactory = {

            resource: PlansResource,

            storage: PlansStorage,

            description: 'plans',

            extendPlan: function(plan) {

                var self = this;

                angular.extend(plan, self);

                return plan;
            },

            get: function(id, success, error) {

                var self = this;

                var callback = function(plan) {

                    return success ? success(plan) : plan;
                };

                return self.resource.get({ id: id}, callback, error);
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
                        resource = self.extendPlan(resource);
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

            getByLeague: function(id, success, error) {
                var self = this;

                var callback = success || function(plans) {
                    return plans;
                };

                error = error || function() {
                    throw new Error('could not get plans');
                };

                return self.resource.getByLeague({leagueId: id}, callback, error);
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

                var callback = function(plans) {

                    var indexedPlans = {};
                    plans.forEach(function(plan) {
                        plan = self.extendPlan(plan);

                        indexedPlans[plan.id] = plan;
                    });
                    plans = index ? indexedPlans : plans;

                    return success ? success(plans) : plans;

                };

                error = error || function() {

                    throw new Error('Could not load plans list');
                };

                return self.resource.query(filter, callback, error);
            },

            save: function(plan) {

                var self = this;

                plan = plan || self;

                if (plan.id) {
                    var updatePlan = new PlansResource(plan);
                    return updatePlan.$update();

                } else {
                    var newPlan = new PlansResource(plan);
                    return newPlan.$create();
                }
            }
        };

        return PlansFactory;
    }
]);
