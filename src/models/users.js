var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('UsersResource', [
    'config', '$resource',
    function(config, $resource) {

        var UsersResource = $resource(

            config.api.uri + 'users/:id',

            {
                id: '@id',
                unique: '@unique'

            }, {
                create: { method: 'POST' },
                update: { method: 'PUT' },
                resendEmail: { method: 'POST', url: config.api.uri + 'users/:unique' + '/emailRequest' },
                emailChange: { method: 'GET', url: config.api.uri + 'users/:id' + '/email-change' },
                postEmailChange: { method: 'POST', url: config.api.uri + 'users/:id' + '/email-change' },
                cancelEmailChange: { method: 'DELETE', url: config.api.uri + 'users/:id' + '/email-change' },
                resendEmailChange: { method: 'PUT', url: config.api.uri + 'users/:id' + '/email-change' },
                resetPassword: { method: 'POST', url: config.api.uri + 'users/password-reset/:token', params: {token: '@token'} },
                confirmEmail: { method: 'POST', url: config.api.uri + 'users/email-change/:token', params: {token: '@token'} },
                getFilmExchangePrivileges: {
                    method: 'GET',
                    url: config.apiV2.uri + 'roles/:roleId' + '/conference_film_exchange_privileges',
                    params: {roleId: '@roleId'},
                    isArray: true
                },
                addFilmExchangePrivilege: {
                    method: 'POST',
                    url: config.apiV2.uri + 'roles/:roleId' + '/conference_film_exchange_privileges',
                    params: {roleId: '@roleId'}
                },
                deleteFilmExchangePrivilege: {
                    method: 'DELETE',
                    url: config.apiV2.uri + 'roles/:roleId' + '/conference_film_exchange_privileges/:privilegeId',
                    params: {roleId: '@roleId', privilegeId: '@privilegeId'}
                },
                typeahead: { method: 'GET', url: config.api.uri + 'service/user-typeahead', isArray: true,
                    //transforms the resource into an array of user objects with extra properties used by the user typeahead
                    transformResponse: function(data) {
                        if (data != 'No users found') {
                            var aggregateResources = JSON.parse(data);
                            return aggregateResources.map(function(resource) {
                                var key = 'user';
                                resource[key].school = resource.school;
                                resource[key].team   = resource.team;
                                return resource[key];
                            });
                        }
                    }
                },
                roleTypeahead: { method: 'GET', url: config.api.uri + 'service/user-role-typeahead', isArray: true,
                    //transforms the resource into an array of user objects with extra properties used by the user typeahead
                    transformResponse: function(data) {
                        if (data != 'No users found') {
                            var aggregateResources = JSON.parse(data);
                            return aggregateResources.map(function(resource) {
                                var key = 'user';
                                resource[key].school = resource.school;
                                resource[key].team   = resource.team;
                                resource[key].role   = resource.role;
                                return resource[key];
                            });
                        }
                    }
                }
            }
        );

        return UsersResource;
    }
]);
