var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.service('SportsStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);

IntelligenceWebClient.factory('SportsFactory', [
    'BaseFactory', 'SportsResource', 'SportsStorage',
    function(BaseFactory, SportsResource, SportsStorage) {

        var SportsFactory = {

            name: 'sports',

            storage: SportsStorage,

            resource: SportsResource,
        };

        angular.extend(SportsFactory, BaseFactory);

        return SportsFactory;
    }
]);

