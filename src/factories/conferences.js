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
            },

            createConferenceSport(conferenceSport) {
                const model = $injector.get(this.model);
                let associationCode = conferenceSport.sportsAssociation;
                let conferenceCode = conferenceSport.conference;
                let combinationCode = `${associationCode}+${conferenceCode}`;
                return model.createConferenceSport({combinationCode}, conferenceSport).$promise;
            },

            loadConferenceSports(associationCode, conferenceCode) {
                const model = $injector.get(this.model);
                let combinationCode = `${associationCode}+${conferenceCode}`;
                return model.readConferenceSport({combinationCode}).$promise;
            },

            updateConferenceSports(conferenceSport) {
                const model = $injector.get(this.model);
                let associationCode = conferenceSport.sportsAssociation;
                let conferenceCode = conferenceSport.conference;
                let gender = conferenceSport.gender;
                let sportId = conferenceSport.sportId;
                let combinationCode = `${associationCode}+${conferenceCode}`;
                let genderSport = `${gender}+${sportId}`;
                return model.updateConferenceSport({combinationCode, genderSport}, conferenceSport).$promise;
            },

            deleteConferenceSports(conferenceSport) {
                const model = $injector.get(this.model);
                let associationCode = conferenceSport.sportsAssociation;
                let conferenceCode = conferenceSport.conference;
                let gender = conferenceSport.gender;
                let sportId = conferenceSport.sportId;
                let combinationCode = `${associationCode}+${conferenceCode}`;
                let genderSport = `${gender}+${sportId}`;
                return model.deleteConferenceSport({combinationCode, genderSport}).$promise;
            }

        };

        angular.augment(ConferencesFactory, BaseFactory);

        return ConferencesFactory;
    }
]);
