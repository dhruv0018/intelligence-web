const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ConferencesStorage', [
    'BaseStorage', 'ConferencesFactory',
    function(BaseStorage, conferences) {

        let ConferencesStorage = Object.create(BaseStorage);

        ConferencesStorage.factory = conferences;
        ConferencesStorage.description = conferences.description;

        return ConferencesStorage;
    }
]);
