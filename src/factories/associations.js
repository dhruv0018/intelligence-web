const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'associations';
const model = 'AssociationsResource';
const storage = 'AssociationsStorage';
const updateLocalResourceOnPUT = true;

IntelligenceWebClient.factory('AssociationsFactory', [
    '$injector',
    'BaseFactory',
    function(
        $injector,
        BaseFactory
    ) {

        const AssociationsFactory = {

            description,
            model,
            storage,
            updateLocalResourceOnPUT,

            loadCompetitionLevels(code) {
                code = code || this.code;
                const model = $injector.get(this.model);
                return model.getCompetitionLevels({code}).$promise;
            },

            createCompetitionLevel(code, data) {
                code = code || this.code;
                const model = $injector.get(this.model);
                return model.createCompetitionLevels({code, data}).$promise;
            }

        };

        angular.augment(AssociationsFactory, BaseFactory);

        return AssociationsFactory;
    }
]);
