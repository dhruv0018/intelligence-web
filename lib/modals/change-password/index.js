/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * ChangePassword page module.
 * @module ChangePassword
 */
var ChangePassword = angular.module('ChangePassword', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
ChangePassword.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('change-password.html', template);
    }
]);

/**
 * ChangePassword Modal
 * @module ChangePassword
 * @name ChangePassword.Modal
 * @type {service}
 */
ChangePassword.value('ChangePassword.ModalOptions', {

    templateUrl: 'change-password.html',
    controller: 'ChangePassword.controller'
});


/**
 * ChangePassword modal dialog.
 * @module ChangePassword
 * @name ChangePassword.Modal
 * @type {service}
 */
ChangePassword.service('ChangePassword.Modal',[
    '$modal', 'ChangePassword.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(dataOptions) {

                var options = angular.extend(modalOptions, dataOptions);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * Change password controller.
 * @module ChangePassword
 * @name ChangePassword.controller
 * @type {controller}
 */
ChangePassword.controller('ChangePassword.controller', [
    '$scope', '$state', '$modalInstance', 'AuthenticationService', 'SessionService',
    function controller($scope, $state, $modalInstance, auth, session) {


        $scope.submitPasswordChange = function(changePassword) {

            var user = angular.copy(session.currentUser);
            user.password = changePassword.newPassword;
            user.save();
            $modalInstance.close();
        };

        $scope.forgot = function() {

            $modalInstance.dismiss();
            auth.logoutUser();
            $state.go('forgot');
        };
    }
]);

