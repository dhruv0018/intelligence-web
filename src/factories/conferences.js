const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'conferences';
const model = 'ConferencesResource';
const storage = 'ConferencesStorage';
const updateLocalResourceOnPUT = true;

IntelligenceWebClient.factory('ConferencesFactory', [
    '$injector',
    'BaseFactory',
    function(
        $injector,
        BaseFactory
    ) {

        const ConferencesFactory = {

            description,
            model,
            storage,
            updateLocalResourceOnPUT,

            loadConferences(associationCode) {
                const model = $injector.get(this.model);
                return model.read({associationCode}).$promise;
            },

            createConference(associationCode, conference) {
                conference = conference || this;
                const model = $injector.get(this.model);
                return model.create({associationCode}, conference).$promise;
            },

            updateConference(conference) {
                conference = conference || this;
                const model = $injector.get(this.model);
                let associationCode = conference.sportsAssociation;
                let conferenceCode = conference.code;
                return model.update({associationCode, conferenceCode}, conference).$promise;
            },

            deleteConference(conference) {
                conference = conference || this;
                const model = $injector.get(this.model);
                let associationCode = conference.sportsAssociation;
                let conferenceCode = conference.code;
                return model.delete({associationCode, conferenceCode}).$promise;
            }

        };

        angular.augment(ConferencesFactory, BaseFactory);

        return ConferencesFactory;
    }
]);
