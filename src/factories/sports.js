var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SportsFactory', [
    'BaseFactory', 'SportsResource', 'SportsStorage',
    function(BaseFactory, SportsResource, SportsStorage) {

        var SportsFactory = {

            description: 'sports',

            storage: SportsStorage,

            resource: SportsResource,
        };

        angular.augment(SportsFactory, BaseFactory);

        return SportsFactory;
    }
]);

