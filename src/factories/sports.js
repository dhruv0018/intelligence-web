var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SportsFactory', [
    'BaseFactory',
    function(BaseFactory) {

        var SportsFactory = {

            description: 'sports',

            model: 'SportsResource',

            storage: 'SportsStorage'
        };

        angular.augment(SportsFactory, BaseFactory);

        return SportsFactory;
    }
]);

