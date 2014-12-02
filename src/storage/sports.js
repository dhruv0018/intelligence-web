var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SportsStorage', [
    'BaseStorage', 'SportsFactory',
    function(BaseStorage, sports) {

        var SportsStorage = Object.create(BaseStorage);

        SportsStorage.description = sports.description;

        return SportsStorage;
    }
]);

