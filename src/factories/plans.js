var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('PlansStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('PlansFactory', [
    '$injector', 'BaseFactory',
    function($injector, BaseFactory) {

        var PlansFactory = {

            description: 'plans',

            model: 'PlansResource',

            storage: 'PlansStorage',

            getByLeague: function(id, success, error) {
                var self = this;

                var callback = success || function(plans) {
                    return plans;
                };

                error = error || function() {
                    throw new Error('could not get plans');
                };

                var model = $injector.get(self.model);

                return model.getByLeague({leagueId: id}, callback, error);
            }
        };

        angular.augment(PlansFactory, BaseFactory);

        return PlansFactory;
    }
]);
