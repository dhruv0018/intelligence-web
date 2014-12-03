var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('PlansStorage', [
    'BaseStorage', 'PlansFactory',
    function(BaseStorage, plans) {

        var PlansStorage = Object.create(BaseStorage);

        PlansStorage.factory = plans;
        PlansStorage.description = plans.description;

        return PlansStorage;
    }
]);

