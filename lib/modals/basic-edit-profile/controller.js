const angular = window.angular;

/**
 * Raw Film controller class
 * @class RawFilm
 */

BasicEditProfileController.$inject = [
    '$scope',
    '$state',
    '$timeout',
    '$uibModalInstance',
    'UsersFactory',
    'SessionService',
    'AlertsService'
];

function BasicEditProfileController (
    $scope,
    $state,
    $timeout,
    $uibModalInstance,
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

    $scope.goAccount = function(){
        $uibModalInstance.close();
        $state.go('Account.ContactInfo');
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
                        $uibModalInstance.close();
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
            $uibModalInstance.close();
            alerts.add({
                type: 'success',
                message: 'Your profile has been saved.'
            });
        }
    };
}

export default BasicEditProfileController;
