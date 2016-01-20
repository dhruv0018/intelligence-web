var pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlaysStorage', [
    'BaseStorage', 'PlaysFactory',
    function(BaseStorage, plays) {

        var PlaysStorage = Object.create(BaseStorage);

        PlaysStorage.factory = plays;
        PlaysStorage.description = plays.description;

        return PlaysStorage;
    }
]);
