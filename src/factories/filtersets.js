var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FiltersetsFactory', [
    'FiltersetsStorage', 'FiltersetsResource', 'BaseFactory',
    function(FiltersetsStorage, FiltersetsResource, BaseFactory) {

        var FiltersetsFactory = {

            description: 'filtersets',

            model: 'FiltersetsResource',

            storage: 'FiltersetsStorage'
        };

        angular.augment(FiltersetsFactory, BaseFactory);

        return FiltersetsFactory;
    }
]);

