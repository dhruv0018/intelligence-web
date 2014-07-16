var PAGE_SIZE = 100;

var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.service('SchoolsStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('SchoolsFactory', [
    'SchoolsResource', 'SchoolsStorage', 'BaseFactory',
    function(SchoolsResource, SchoolsStorage, BaseFactory) {

        var SchoolsFactory = {

            description: 'schools',

            storage: SchoolsStorage,

            resource: SchoolsResource,
        };

        angular.augment(SchoolsFactory, BaseFactory);

        return SchoolsFactory;
    }
]);

