var IntelligenceWebClient = require('../app');

IntelligenceWebClient.factory('TokenService', [
    '$http',
    function($http) {

        var accessToken = '';
        var refreshToken = '';

        var setAccessToken = function(token) {

            accessToken = token;
            $http.defaults.headers.common.Authorization = 'Bearer ' + token;
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

