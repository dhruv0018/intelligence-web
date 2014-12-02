var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('UsersStorage', [
    'BaseStorage', 'UsersFactory',
    function(BaseStorage, users) {

        var UsersStorage = Object.create(BaseStorage);

        UsersStorage.description = users.description;

        return UsersStorage;
    }
]);

