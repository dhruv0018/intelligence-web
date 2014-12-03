var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FiltersetsStorage', [
    'BaseStorage', 'FiltersetsFactory',
    function(BaseStorage, filtersets) {

        var FiltersetsStorage = Object.create(BaseStorage);

        FiltersetsStorage.factory = filtersets;
        FiltersetsStorage.description = filtersets.description;

        return FiltersetsStorage;
    }
]);

