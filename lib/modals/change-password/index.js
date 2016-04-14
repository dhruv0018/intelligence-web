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
    '$scope', '$state', '$modalInstance', 'AuthenticationService', 'SessionService', '$timeout',
    function controller($scope, $state, $modalInstance, auth, session, $timeout) {

        $scope.isProcessing = false;

        $scope.submitPasswordChange = function(newPassword) {
            $scope.isProcessing = true;
            var user = angular.copy(session.currentUser);
            user.password = newPassword;
            user.save().then(function(){
                $timeout(function(){
                    $scope.isProcessing = false;
                    $modalInstance.close();
                }, 200);
            });
        };

        $scope.forgot = function() {

            $modalInstance.dismiss();
            auth.logoutUser();
            $state.go('forgot');
        };
    }
]);
