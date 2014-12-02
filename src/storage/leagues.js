var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('LeaguesStorage', [
    'BaseStorage', 'LeaguesFactory',
    function(BaseStorage, leagues) {

        var LeaguesStorage = Object.create(BaseStorage);

        LeaguesStorage.description = leagues.description;

        return LeaguesStorage;
    }
]);

