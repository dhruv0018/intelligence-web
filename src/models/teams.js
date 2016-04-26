var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('TeamsResource', [
    'config', '$resource',
    function(config, $resource) {

        var base = 'teams';

        var url = config.api.uri + base + '/:id';

        var paramDefaults = {

            id: '@id'

        };

        var actions = {

            create: { method: 'POST' },
            update: { method: 'PUT' },
            getRemainingBreakdowns: {
                method: 'GET',
                url: url + '/remainingBreakdowns'
            },
            generateStats: {
                method: 'GET',
                url: url + '/analytics',
                isArray: true
            },
            getAvailableConferences:{
                method: 'GET',
                url: url + '/candidate-conferences',
                isArray: true
            },
            getConferences:{
                method: 'GET',
                url: url + '/conference-memberships',
                isArray: true
            },
            createConference:{
                method: 'POST',
                url: url + '/conference-memberships'
            },
            deleteConference: {
                method: 'DELETE',
                url: url + '/conference-memberships/:conferenceId',
                params: {id: '@id', conferenceId: '@conferenceId'}
            },
            updateConference: {
                method: 'PUT',
                url: url + '/conference-memberships/:conferenceId',
                params: {id: '@id', conferenceId: '@conferenceId'}
            }
        };

        return $resource(url, paramDefaults, actions);
    }
]);
