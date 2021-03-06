const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'conferences';
const model = 'ConferencesResource';
const storage = 'ConferencesStorage';
const updateLocalResourceOnPUT = true;

IntelligenceWebClient.factory('ConferencesFactory', [
    '$injector',
    '$q',
    'config',
    'BaseFactory',
    function(
        $injector,
        $q,
        config,
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
            },

            getConferencesList(filter, getHead = true) {
                const model = $injector.get(this.model);
                let query = filter || {};
                query.count = (filter && filter.count) ? filter.count :  1000;
                query.start = (filter && filter.page) ? (filter.page-1) * query.count : 0;
                delete query.page;
                let conferenePromises = model.getConferencesList(query).$promise.then(
                    conferences =>{
                        return conferences.map(conference =>{
                            conference.stringID = conference.sportsAssociation+'+'+conference.conference.code+'+'+conference.gender+'+'+conference.sportId;
                            return conference;
                        });
                    }
                );
                let promises = [conferenePromises];
                if(getHead){
                    let url = `${config.apiV2.uri}conference-sports`;
                    let countPromises = this.totalCount(query, url);
                    promises.push(countPromises);
                }
                return $q.all(promises).then(
                    data =>{
                        let conferences = {};
                        conferences.data = data[0];
                        if(getHead){
                            conferences.count = data[1];
                        }
                        return conferences;
                    }
                );
            },

            createFilmExchange(filmExchange) {
                const model = $injector.get(this.model);
                let associationCode = filmExchange.sportsAssociation;
                let conferenceCode = filmExchange.conference;
                let gender = filmExchange.gender;
                let sportId = filmExchange.sportId;
                let combinationCode = `${associationCode}+${conferenceCode}+${gender}+${sportId}`;
                return model.createFilmExchange({combinationCode}, filmExchange).$promise;
            },

            loadFilmExchanges(associationCode, conferenceCode, gender, sportId) {
                const model = $injector.get(this.model);
                let combinationCode = `${associationCode}+${conferenceCode}+${gender}+${sportId}`;
                return model.readFilmExchanges({combinationCode}).$promise;
            },

            updateFilmExchange(filmExchange) {
                const model = $injector.get(this.model);
                let associationCode = filmExchange.sportsAssociation;
                let conferenceCode = filmExchange.conference;
                let gender = filmExchange.gender;
                let sportId = filmExchange.sportId;
                let combinationCode = `${associationCode}+${conferenceCode}+${gender}+${sportId}`;
                let filmExchangeId = filmExchange.id;
                return model.updateFilmExchange({combinationCode, filmExchangeId}, filmExchange).$promise;
            },

            deleteFilmExchange(filmExchange) {
                const model = $injector.get(this.model);
                let associationCode = filmExchange.sportsAssociation;
                let conferenceCode = filmExchange.conference;
                let gender = filmExchange.gender;
                let sportId = filmExchange.sportId;
                let combinationCode = `${associationCode}+${conferenceCode}+${gender}+${sportId}`;
                let filmExchangeId = filmExchange.id;
                return model.deleteFilmExchange({combinationCode, filmExchangeId}).$promise;
            },

            getAllFilmExchangesForAssociation(sportsAssociation, count) {
                const model = $injector.get(this.model);
                count = count || 1000;
                return model.getAllFilmExchangesForAssociation({sportsAssociation, count}).$promise;
            },

            loadTeamsInConference(filter) {
                const model = $injector.get(this.model);
                return model.getTeamsInConference(filter).$promise;
            }

        };

        angular.augment(ConferencesFactory, BaseFactory);

        return ConferencesFactory;
    }
]);
