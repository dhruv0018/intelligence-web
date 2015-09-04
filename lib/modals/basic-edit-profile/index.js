/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * BasicEditProfile page module.
 * @module BasicEditProfile
 */
const BasicEditProfile = angular.module('BasicEditProfile', [
    'ui.bootstrap'
]);

/* Cache the template file */
BasicEditProfile.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('basic-edit-profile.html', template);
    }
]);

/**
 * BasicEditProfile Modal
 * @module BasicEditProfile
 * @name BasicEditProfile.Modal
 * @type {service}
 */
BasicEditProfile.value('BasicEditProfile.ModalOptions', {

    templateUrl: 'basic-edit-profile.html',
    controller: 'BasicEditProfile.controller',
    size: 'md'
});


/**
 * BasicEditProfile modal dialog.
 * @module BasicEditProfile
 * @name BasicEditProfile.Modal
 * @type {service}
 */
BasicEditProfile.service('BasicEditProfile.Modal',[
    '$modal', 'BasicEditProfile.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function(options) {

                options = options || {};
                angular.extend(modalOptions, options);

                return $modal.open(modalOptions);
            }
        };

        return Modal;
    }
]);

/**
 * BasicEditProfile controller.
 * @module BasicEditProfile
 * @name BasicEditProfile.controller
 * @type {controller}
 */
BasicEditProfile.controller('BasicEditProfile.controller', [
    '$scope',
    '$timeout',
    '$modalInstance',
    'UsersFactory',
    'SessionService',
    'AlertsService',
    function controller(
        $scope,
        $timeout,
        $modalInstance,
        users,
        session,
        alerts
    ) {
        $scope.currentUser = session.getCurrentUser();
        $scope.tempUser = {
            imageUrl: $scope.currentUser.imageUrl,
            firstName: $scope.currentUser.firstName,
            lastName: $scope.currentUser.lastName
        };

        $scope.setProfilePicture = function setProfilePicture(files) {
            let reader = new FileReader();

            $scope.tempUser.fileImage = files[0];

            reader.readAsDataURL(files[0]);

            reader.onload = function onload() {
                $scope.tempUser.imageUrl = this.result;
                $scope.$apply();
            };
        };

        $scope.saveUserProfile = function() {
            // Set temporary name properties to currentUser
            $scope.currentUser.firstName = $scope.tempUser.firstName;
            $scope.currentUser.lastName = $scope.tempUser.lastName;

            if ($scope.tempUser.fileImage) {
                // Set temporary file image property to currentUser
                $scope.currentUser.fileImage = $scope.tempUser.fileImage;
                $scope.currentUser.imageUrl = $scope.tempUser.imageUrl;
                $scope.isSaving = true;
                $scope.currentUser.uploadProfilePicture()
                    .success(responseUser => {
                        $scope.currentUser.imageUrl = responseUser.imageUrl;
                        $scope.currentUser.save().then(function saveConfirmation() {
                            // Add 2 seconds so user gets feedback even if save happens quickly
                            $timeout(function() {
                                $scope.confirmSave = true;
                            }, 1000);
                            $timeout(function() {
                                $scope.isSaving = false;
                                $scope.confirmSave = false;
                            }, 2000);
                            $modalInstance.close();
                        });
                        alerts.add({
                            type: 'success',
                            message: 'Your profile has been saved.'
                        });
                        delete $scope.currentUser.fileImage;
                    })
                    .error( () => {
                        delete $scope.currentUser.imageUrl;
                        alerts.add({
                            type: 'danger',
                            message: 'The image upload failed.'
                        });
                    });
            } else {
                $scope.currentUser.save();
                $modalInstance.close();
                alerts.add({
                    type: 'success',
                    message: 'Your profile has been saved.'
                });
            }
        };
    }
]);
