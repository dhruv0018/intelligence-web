var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TeamsStorage', [
    'BaseStorage', 'TeamsFactory',
    function(BaseStorage, teams) {

        var TeamsStorage = Object.create(BaseStorage);

        TeamsStorage.factory = teams;
        TeamsStorage.description = teams.description;

        return TeamsStorage;
    }
]);

