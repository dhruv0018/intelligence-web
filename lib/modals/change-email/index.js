/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * ChangeEmail page module.
 * @module ChangeEmail
 */
var ChangeEmail = angular.module('ChangeEmail', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
ChangeEmail.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('change-email.html', template);
    }
]);

/**
 * ChangeEmail Modal
 * @module ChangeEmail
 * @name ChangeEmail.Modal
 * @type {service}
 */
ChangeEmail.value('ChangeEmail.ModalOptions', {

    templateUrl: 'change-email.html',
    controller: 'ChangeEmail.controller'
});


/**
 * ChangeEmail modal dialog.
 * @module ChangeEmail
 * @name ChangeEmail.Modal
 * @type {service}
 */
ChangeEmail.service('ChangeEmail.Modal',[
    '$modal', 'ChangeEmail.ModalOptions',
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
 * Change email controller.
 * @module ChangeEmail
 * @name ChangeEmail.controller
 * @type {controller}
 */
ChangeEmail.controller('ChangeEmail.controller', [
    '$scope', '$window', '$modalInstance', 'SessionService',
    function controller($scope, $window, $modalInstance, session) {

        let user = angular.copy(session.currentUser);
        $scope.user = user;
        $scope.submit = function(newEmail){
            user.changeEmail(user, newEmail, $scope.currentPassword)
                .success(function(response){
                    $modalInstance.close(response);
                })
                .error(function(error){
                    if(error.requestedEmail){
                        $scope.changeEmailForm.newEmail.$setValidity('exist', false);
                    }else{
                        $scope.changeEmailForm.password.$setValidity('password', false);
                    }
                });
        };
    }
]);
