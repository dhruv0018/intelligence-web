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
    'BaseFactory', 'PlansResource', 'PlansStorage',
    function(BaseFactory, PlansResource, PlansStorage) {

        var PlansFactory = {

            description: 'plans',

            storage: PlansStorage,

            resource: PlansResource,

            getByLeague: function(id, success, error) {
                var self = this;

                var callback = success || function(plans) {
                    return plans;
                };

                error = error || function() {
                    throw new Error('could not get plans');
                };

                return self.resource.getByLeague({leagueId: id}, callback, error);
            }
        };

        angular.augment(PlansFactory, BaseFactory);

        return PlansFactory;
    }
]);
