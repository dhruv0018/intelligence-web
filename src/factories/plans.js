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

                var self = this;

                if (angular.isFunction(filter)) {

                    index = error;
                    error = success;
                    success = filter;
                    filter = null;
                }

                filter = filter || {};

                var callback = function(plans) {


                };
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
