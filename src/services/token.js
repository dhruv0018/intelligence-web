var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TokenService', [
    '$rootScope',
    function($rootScope) {

        var accessToken = '';
        var refreshToken = '';

        var setAccessToken = function(token) {
            accessToken = token;
        };

        var getAccessToken = function() {
            return accessToken;
        };

        return {

            setAccessToken: setAccessToken,
            getAccessToken: getAccessToken
        };
    }
]);

