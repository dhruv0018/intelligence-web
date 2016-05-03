const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ConferencesResource', [
    'config', '$resource',
    function(config, $resource) {

        const associationsBase = 'sports-associations';
        const conferencesBase = 'conferences';
        const conferenceSportsBase = 'conference-sports';
        const filmExchangeBase = 'conference-film-exchanges';

        let url = `${config.apiV2.uri}`;

        let paramDefaults = {};

        let actions = {
            create: {
                method: 'POST',
                url: `${url}${associationsBase}/:associationCode/conferences`,
                params: {associationCode: '@associationCode'}
            },
            read: {
                method: 'GET',
                url: `${url}${associationsBase}/:associationCode/conferences`,
                params: {associationCode: '@associationCode'},
                isArray: true
            },
            update: {
                method: 'PUT',
                url: `${url}${associationsBase}/:associationCode/conferences/:conferenceCode`,
                params: {associationCode: '@associationCode', conferenceCode: '@conferenceCode'}
            },
            delete: {
                method: 'DELETE',
                url: `${url}${associationsBase}/:associationCode/conferences/:conferenceCode`,
                params: {associationCode: '@associationCode', conferenceCode: '@conferenceCode'}
            },
            createConferenceSport: {
                method: 'POST',
                url: `${url}${conferencesBase}/:combinationCode/sports`,
                params: {combinationCode: '@combinationCode'}
            },
            readConferenceSport: {
                method: 'GET',
                url: `${url}${conferencesBase}/:combinationCode/sports`,
                params: {combinationCode: '@combinationCode'},
                isArray: true
            },
            updateConferenceSport: {
                method: 'PUT',
                url: `${url}${conferencesBase}/:combinationCode/sports/:genderSport`,
                params: {combinationCode: '@combinationCode', genderSport: '@genderSport'}
            },
            deleteConferenceSport: {
                method: 'DELETE',
                url: `${url}${conferencesBase}/:combinationCode/sports/:genderSport`,
                params: {combinationCode: '@combinationCode', genderSport: '@genderSport'}
            },
            getAllConferenceSportsForAssociation: {
                method: 'GET',
                url: `${url}${conferenceSportsBase}`,
                params: {sportsAssociation: '@sportsAssociation'},
                isArray: true
            },
            createFilmExchange: {
                method: 'POST',
                url: `${url}${conferenceSportsBase}/:combinationCode/film-exchange`,
                params: {combinationCode: '@combinationCode'}
            },
            readFilmExchanges: {
                method: 'GET',
                url: `${url}${conferenceSportsBase}/:combinationCode/film-exchange`,
                params: {combinationCode: '@combinationCode'},
                isArray: true
            },
            updateFilmExchange: {
                method: 'PUT',
                url: `${url}${conferenceSportsBase}/:combinationCode/film-exchange/:filmExchangeId`,
                params: {combinationCode: '@combinationCode', filmExchangeId: '@filmExchangeId'}
            },
            deleteFilmExchange: {
                method: 'DELETE',
                url: `${url}${conferenceSportsBase}/:combinationCode/film-exchange/:filmExchangeId`,
                params: {combinationCode: '@combinationCode', filmExchangeId: '@filmExchangeId'}
            },
            getAllFilmExchangesForAssociation: {
                method: 'GET',
                url: `${url}${filmExchangeBase}`,
                params: {sportsAssociation: '@sportsAssociation'},
                isArray: true
            },
            getTeamsInFilmExchange: {
                method: 'GET',
                url: `${url}${filmExchangeBase}/:combinationCode/teams`,
                params: {combinationCode: '@combinationCode'},
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
