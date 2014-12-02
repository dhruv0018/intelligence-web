var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlayersStorage', [
    'BaseStorage', 'PlayersFactory',
    function(BaseStorage, players) {

        var PlayersStorage = Object.create(BaseStorage);

        PlayersStorage.description = players.description;

        return PlayersStorage;
    }
]);

