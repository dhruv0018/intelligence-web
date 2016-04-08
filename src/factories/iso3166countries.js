const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'iso3166countries';
const model = 'Iso3166countriesResource';
const storage = 'Iso3166countriesStorage';

IntelligenceWebClient.factory('Iso3166countriesFactory', [
    'BaseFactory',
    function(
        BaseFactory
    ) {

        const Iso3166countriesFactory = {

            description,
            model,
            storage

        };

        angular.augment(Iso3166countriesFactory, BaseFactory);

        return Iso3166countriesFactory;
    }
]);
