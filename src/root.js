var IntelligenceWebClient = require('./app');

/**
 * Root controller.
 * @module IntelligenceWebClient
 * @name RootController
 * @type {Controller}
 */
IntelligenceWebClient.controller('RootController', [
    '$scope', '$state', 'SessionService', 'AuthenticationService',
    function controller($scope, $state, session, auth) {

        if (auth.isLoggedIn) {

            $scope.currentUser = session.retrieveCurrentUser();
        }
    }
]);
