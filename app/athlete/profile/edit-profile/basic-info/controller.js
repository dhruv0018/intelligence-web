/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * EditProfile.BasicInfo page module.
 * @module EditProfile.BasicInfo
 */
const BasicInfo = angular.module('Athlete.Profile.EditProfile.BasicInfo');

/*
* EditProfile.BasicInfo dependencies
*/
BasicInfoController.$inject = [
    '$scope',
    '$http',
    '$timeout',
    'config',
    'UsersFactory',
    'SportsFactory',
    'SessionService',
    'AlertsService',
    'Athlete.Profile.EditProfile.Data'
];

/**
 * EditProfile.BasicInfo controller.
 * @module EditProfile.BasicInfo
 * @name EditProfile.BasicInfo.controller
 * @type {controller}
 */
function BasicInfoController (
    $scope,
    $http,
    $timeout,
    config,
    users,
    sports,
    session,
    alerts,
    data
) {
    $scope.athlete = session.getCurrentUser();
    $scope.sports = sports.getList();
    $scope.maxAboutMeLength = 200;

    $scope.setProfilePicture = function setProfilePicture(files) {
        let reader = new FileReader();

        $scope.athlete.fileImage = files[0];

        reader.readAsDataURL(files[0]);

        reader.onload = function onload() {
            $scope.athlete.imageUrl = this.result;
            $scope.$apply();
        };
    };

    $scope.isSaving = false;
    $scope.confirmSave = false;

    $scope.saveBasicInfo = function saveBasicInfo() {
        if ($scope.athlete.fileImage) {
            $scope.athlete.uploadProfilePicture()
                .success(function(responseUser) {
                    $scope.athlete.imageUrl = responseUser.imageUrl;
                    $scope.isSaving = true;
                    $scope.athlete.save().then(function saveConfirmation() {
                        // Add 2 seconds so user gets feedback even if save happens quickly
                        $timeout(function() {
                            $scope.confirmSave = true;
                        }, 1000);
                        $timeout(function() {
                            $scope.isSaving = false;
                            $scope.confirmSave = false;
                        }, 2000);
                    });
                    delete $scope.athlete.fileImage;
                })
                .error(function() {
                    delete $scope.athlete.imageUrl;
                    alerts.add({
                        type: 'danger',
                        message: 'The image upload failed.'
                    });
                });
        } else {
            $scope.isSaving = true;
            $scope.athlete.save().then(function() {
                // Add 2 seconds so user gets feedback even if save happens quickly
                $timeout(function() {
                    $scope.confirmSave = true;
                }, 1000);
                $timeout(function() {
                    $scope.isSaving = false;
                    $scope.confirmSave = false;
                }, 2000);
            });
        }
    };
}

BasicInfo.controller('Athlete.Profile.EditProfile.BasicInfo.controller', BasicInfoController);

export default BasicInfoController;
