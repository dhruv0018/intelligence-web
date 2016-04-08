const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('Iso3166countriesStorage', [
    'BaseStorage', 'Iso3166countriesFactory',
    function(BaseStorage, iso3166countries) {

        let Iso3166countriesStorage = Object.create(BaseStorage);

        Iso3166countriesStorage.factory = iso3166countries;
        Iso3166countriesStorage.description = iso3166countries.description;

        return Iso3166countriesStorage;
    }
]);
