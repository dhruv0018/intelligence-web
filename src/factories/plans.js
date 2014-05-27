var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('PlansFactory', [
    'PlansResource',
    function(PlansResource) {

        var PlansFactory = {

            resource: PlansResource,

            get: function(id, success, error) {

                var self = this;

                var callback = function(plan) {

                    return success ? success(plan) : plan;
                };

                return self.resource.get({ id: id}, callback, error);
            },

            getList: function(filter, success, error, index) {

                console.log('its happening');

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
                    console.log('updating a plan');
                    var updatePlan = new PlansResource(plan);
                    return updatePlan.$update();

                } else {
                    console.log(plan);
                    var newPlan = new PlansResource(plan);
                    return newPlan.$create();
                }
            }
        };

        return PlansFactory;
    }
]);
