var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('FiltersetsFactory', [
    'FiltersetsStorage', 'FiltersetsResource', 'BaseFactory',
    function(FiltersetsStorage, FiltersetsResource, BaseFactory) {

        var FiltersetsFactory = {

            description: 'filtersets',

            storage: FiltersetsStorage,

            resource: FiltersetsResource,
        };

        angular.extend(FiltersetsFactory, BaseFactory);

        return FiltersetsFactory;
    }
]);
