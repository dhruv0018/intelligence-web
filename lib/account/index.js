/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Account page module.
 * @module Account
 */
var Account = angular.module('account', [
    'ui.router',
    'ui.bootstrap',
    'ui.validate'
]);

/* Cache the template file */
Account.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('account.html', require('./template.html'));
        $templateCache.put('contact-info.html', require('./contact-info.html'));
        $templateCache.put('roles-list.html', require('./roles-list.html'));
        $templateCache.put('change-password.html', require('./change-password.html'));
    }
]);

/**
 * Account page state router.
 * @module Account
 * @type {UI-Router}
 */
Account.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('account', {
                url: '/account',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'account.html',
                        controller: 'AccountController'
                    }
                }
            })

            .state('contact-info', {
                url: '',
                parent: 'account',
                views: {
                    'content@account': {
                        templateUrl: 'contact-info.html',
                        controller: 'AccountController'
                    }
                }
            })

            .state('roles-list', {
                url: '',
                parent: 'account',
                views: {
                    'content@account': {
                        templateUrl: 'roles-list.html',
                        controller: 'AccountController'
                    }
                }
            });
    }
]);

/**
 * Change password controller.
 * @module Account
 * @name ChangePasswordController
 * @type {Controller}
 */
Account.controller('ChangePasswordController', [
    '$scope', '$state', '$modalInstance', 'AuthenticationService', 'SessionService',
    function controller($scope, $state, $modalInstance, auth, session) {

        $scope.submitPasswordChange = function(changePassword) {

            var user = angular.copy(session.currentUser);

            user.password = changePassword.newPassword;

            user.save();

            $modalInstance.close();

            $state.go('contact-info');
        };

        $scope.cancel = function() {

            $modalInstance.dismiss();

            $state.go('contact-info');
        };

        $scope.forgot = function() {

            $modalInstance.dismiss();

            auth.logoutUser();

            $state.go('forgot');
        };
    }
]);

/**
 * Account controller.
 * @module Account
 * @name AccountController
 * @type {Controller}
 */
Account.controller('AccountController', [
    '$scope', '$state', '$modal', 'SessionService', 'AuthenticationService', 'ROLES',
    function controller($scope, $state, $modal, session, auth, ROLES) {

        $scope.COACH = ROLES.COACH;
        $scope.PARENT = ROLES.PARENT;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.INDEXER = ROLES.INDEXER;

        $scope.currentUser = session.currentUser;

        $scope.addAthleteRole = function() {

            $scope.currentUser.addRole(ROLES.ATHLETE);
            session.storeCurrentUser($scope.currentUser);
        };

        $scope.callChangePasswordModal = function() {

            $modal.open({

                templateUrl: 'change-password.html',
                controller: 'ChangePasswordController'
            });
        };
    }
]);

