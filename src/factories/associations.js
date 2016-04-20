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

            createCompetitionLevel(associationCode, competitionLevel) {
                associationCode = associationCode || this.code;
                const model = $injector.get(this.model);
                return model.createCompetitionLevels({associationCode}, competitionLevel).$promise;
            }

        };

        angular.augment(AssociationsFactory, BaseFactory);

        return AssociationsFactory;
    }
]);
