var IntelligenceWebClient = require('../app');

function AuthenticationService($rootScope) {

    this.$rootScope = $rootScope;

    $rootScope.currentUser = null;

    this.loginUser = function(user) {
        $rootScope.currentUser = user;
    };

    this.logoutUser = function() {
        $rootScope.currentUser = null;
    };

    this.isLoggedIn = function() {
        return !!$rootScope.currentUser;
    };
}

IntelligenceWebClient.service('AuthenticationService', AuthenticationService);

