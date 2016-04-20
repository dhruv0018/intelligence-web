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

            createCompetitionLevel(code, competitionLevel) {
                code = code || this.code;
                const model = $injector.get(this.model);
                return model.createCompetitionLevel({code}, competitionLevel).$promise;
            },

            updateCompetitionLevel(competitionLevel) {
                const model = $injector.get(this.model);
                let associationCode = competitionLevel.sportsAssociation;
                let compLevelCode = competitionLevel.code;
                return model.updateCompetitionLevel({associationCode, compLevelCode}, competitionLevel).$promise;
            },

            deleteCompetitionLevel(competitionLevel) {
                const model = $injector.get(this.model);
                let associationCode = competitionLevel.sportsAssociation;
                let compLevelCode = competitionLevel.code;
                return model.deleteCompetitionLevel({associationCode, compLevelCode}).$promise;
            }

        };

        angular.augment(AssociationsFactory, BaseFactory);

        return AssociationsFactory;
    }
]);
