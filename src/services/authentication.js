var IntelligenceWebClient = require('../app');

function AuthenticationService($rootScope) {

    this.$rootScope = $rootScope;

    $rootScope.currentUser = null;

    this.loginUser = function(user) {
        $rootScope.currentUser = user;
        $rootScope.isLoggedIn = true;
    };

    this.logoutUser = function() {
        $rootScope.currentUser = null;
        $rootScope.isLoggedIn = false;
    };

    this.currentUser = function() {

        return $rootScope.currentUser;
    };
}

Object.defineProperty(AuthenticationService.prototype, 'isLoggedIn', {

    get: function isLoggedIn() {

        return !!this.$rootScope.currentUser;
    },

    set: function isLoggedIn() {

        throw new Error('Illegal attempt to override function isLoggedIn');
    }
});

IntelligenceWebClient.service('AuthenticationService', AuthenticationService);

