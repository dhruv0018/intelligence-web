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
                resetPassword: { method: 'POST', url: config.api.uri + 'users/password-reset/:token', params: {token: '@token'} },
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
                }
            }
        );

        return UsersResource;
    }
]);
