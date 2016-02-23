const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'formationlabels';
const model = 'FormationLabelsResource';
const storage = 'FormationLabelsStorage';
const updateLocalResourceOnPUT = true;

IntelligenceWebClient.factory('FormationLabelsFactory', [
    'BaseFactory',
    function(
        BaseFactory
    ) {

        const FormationLabelsFactory = {

            description,
            model,
            storage,
            updateLocalResourceOnPUT

        };

        angular.augment(FormationLabelsFactory, BaseFactory);

        return FormationLabelsFactory;
    }
]);
