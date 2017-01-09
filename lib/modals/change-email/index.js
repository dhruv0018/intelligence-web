const angular = window.angular;

/**
 * ChangeEmail page module.
 * @module ChangeEmail
 */
const ChangeEmail = angular.module('ChangeEmail', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * ChangeEmail Modal
 * @module ChangeEmail
 * @name ChangeEmail.Modal
 * @type {service}
 */
ChangeEmail.value('ChangeEmail.ModalOptions', {

    templateUrl: 'lib/modals/change-email/template.html',
    controller: 'ChangeEmail.controller'
});


/**
 * ChangeEmail modal dialog.
 * @module ChangeEmail
 * @name ChangeEmail.Modal
 * @type {service}
 */
ChangeEmail.service('ChangeEmail.Modal',[
    '$uibModal', 'ChangeEmail.ModalOptions',
    function($uibModal, modalOptions) {

        const Modal = {

            open: function(dataOptions) {

                var options = angular.extend(modalOptions, dataOptions);

                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * Change email controller.
 * @module ChangeEmail
 * @name ChangeEmail.controller
 * @type {controller}
 */
ChangeEmail.controller('ChangeEmail.controller', [
    '$scope',
    '$window',
    '$uibModalInstance',
    'SessionService',
    function controller(
        $scope,
        $window,
        $uibModalInstance,
        session
    ) {

        let user = angular.copy(session.currentUser);
        $scope.user = user;
        $scope.isProcessing = false;

        $scope.submit = function(newEmail){
            $scope.isProcessing = true;
            user.changeEmail(user, newEmail, $scope.currentPassword)
                .then(function(response){
                    $scope.isProcessing = false;
                    $uibModalInstance.close(response);
                },
                function(error){
                    if(error.data.requestedEmail){
                        $scope.changeEmailForm.newEmail.$setValidity('exist', false);
                    }else{
                        $scope.changeEmailForm.password.$setValidity('password', false);
                    }
                });
        };
    }
]);

export default ChangeEmail;
