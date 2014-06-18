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
        };

        angular.augment(PlansFactory, BaseFactory);

        return PlansFactory;
    }
]);
