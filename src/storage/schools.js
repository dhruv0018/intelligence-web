var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SchoolsStorage', [
    'BaseStorage', 'SchoolsFactory',
    function(BaseStorage, schools) {

        var SchoolsStorage = Object.create(BaseStorage);

        SchoolsStorage.factory = schools;
        SchoolsStorage.description = schools.description;

        return SchoolsStorage;
    }
]);
