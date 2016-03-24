const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'associations';
const model = 'AssociationsResource';
const storage = 'AssociationsStorage';
const updateLocalResourceOnPUT = true;

IntelligenceWebClient.factory('AssociationsFactory', [
    'BaseFactory',
    function(
        BaseFactory
    ) {

        const AssociationsFactory = {

            description,
            model,
            storage,
            updateLocalResourceOnPUT

        };

        angular.augment(AssociationsFactory, BaseFactory);

        return AssociationsFactory;
    }
]);
