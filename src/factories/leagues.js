var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('LeaguesStorage', [
    function() {

        this.list = [];
        this.collection = {};
    }
]);


IntelligenceWebClient.factory('LeaguesFactory', [
    'LeaguesStorage', 'LeaguesResource', 'BaseFactory',
    function(LeaguesStorage, LeaguesResource, BaseFactory) {

        var LeaguesFactory = {

            description: 'leagues',

            model: 'LeaguesResource',

            storage: 'LeaguesStorage'
        };

        angular.augment(LeaguesFactory, BaseFactory);

        return LeaguesFactory;
    }
]);

