const angular = window.angular;

/**
 * ChangePassword page module.
 * @module ChangePassword
 */
const ChangePassword = angular.module('ChangePassword', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * ChangePassword Modal
 * @module ChangePassword
 * @name ChangePassword.Modal
 * @type {service}
 */
ChangePassword.value('ChangePassword.ModalOptions', {

    templateUrl: 'lib/modals/change-password/template.html',
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

        const Modal = {

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
    '$scope',
    '$state',
    '$modalInstance',
    'AuthenticationService',
    'SessionService',
    '$timeout',
    function controller(
        $scope,
        $state,
        $modalInstance,
        auth,
        session,
        $timeout
    ) {

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

export default ChangePassword;
