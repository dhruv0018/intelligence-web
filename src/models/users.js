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
                unique: '@unique',
                token: '@token'

            }, {
                create: { method: 'POST' },
                update: { method: 'PUT' },
                resendEmail: { method: 'POST', url: config.api.uri + 'users/:unique' + '/emailRequest' },
                resetPassword: { method: 'POST', url: config.api.uri + 'users/password-reset/:token' }
            }
        );

        return UsersResource;
    }
]);

