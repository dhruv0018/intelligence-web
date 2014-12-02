var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('GamesStorage', [
    'BaseStorage', 'GamesFactory',
    function(BaseStorage, games) {

        var GamesStorage = Object.create(BaseStorage);

        GamesStorage.description = games.description;

        return GamesStorage;
    }
]);

