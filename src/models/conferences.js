const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('ConferencesResource', [
    'config', '$resource',
    function(config, $resource) {

        const associationsBase = 'sports-associations';
        const conferencesBase = 'conferences';
        const conferenceSportsBase = 'conference-sports';

        let url = `${config.api.uri}`;

        let paramDefaults = {

            id: '@id',

        };

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
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
