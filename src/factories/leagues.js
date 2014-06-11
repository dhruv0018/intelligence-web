var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('LeaguesFactory', [
    'LeaguesStorage', 'LeaguesResource', 'BaseFactory',
    function(LeaguesStorage, LeaguesResource, BaseFactory) {

        var LeaguesFactory = {

            description: 'leagues',

            storage: LeaguesStorage,

            resource: LeaguesResource,
        };

        angular.extend(LeaguesFactory, BaseFactory);

        return LeaguesFactory;
    }
]);

