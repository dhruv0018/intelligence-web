/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.BasicInfo page module.
 * @module EditProfile.BasicInfo
 */
var BasicInfo = angular.module('Athlete.Profile.EditProfile.BasicInfo');

/*
* EditProfile.BasicInfo dependencies
*/
BasicInfoController.$inject = [
    '$scope',
    '$http',
    'config',
    'UsersFactory',
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
    config,
    users,
    session,
    alerts,
    data
) {
    $scope.athlete = session.getCurrentUser();
    $scope.maxAboutMeLength = 200;

    $scope.setProfilePicture = function setProfilePicture(files) {
        let reader = new FileReader();

        $scope.athlete.fileImage = files[0]; // resolve user

        reader.readAsDataURL(files[0]);

        reader.onload = function onload() {
            $scope.athlete.imageUrl = this.result;
            $scope.$apply();
        };
    };

    $scope.saveBasicInfo = function saveBasicInfo() {
        if ($scope.athlete.fileImage) {
            $scope.athlete.uploadProfilePicture()
                .success(function(responseUser) {
                    $scope.athlete.imageUrl = responseUser.imageUrl;
                    $scope.athlete.save().then(function() {
                        alerts.add({
                            type: 'success',
                            message: 'Your profile has been saved.'
                        });
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
            $scope.athlete.save().then(function() {
                alerts.add({
                    type: 'success',
                    message: 'Your profile has been saved.'
                });
            });
        }
    };
}

BasicInfo.controller('Athlete.Profile.EditProfile.BasicInfo.controller', BasicInfoController);

export default BasicInfoController;
