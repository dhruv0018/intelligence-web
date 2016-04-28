const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'iso3166countries';
const model = 'Iso3166countriesResource';
const storage = 'Iso3166countriesStorage';

IntelligenceWebClient.factory('Iso3166countriesFactory', [
    '$injector',
    'BaseFactory',
    function(
        $injector,
        BaseFactory
    ) {

        const Iso3166countriesFactory = {

            description,
            model,
            storage,

            getRegions: function(code) {
                const model = $injector.get(this.model);

                return model.getRegions({ code: code }).$promise;
            }

        };

        angular.augment(Iso3166countriesFactory, BaseFactory);

        return Iso3166countriesFactory;
    }
]);
