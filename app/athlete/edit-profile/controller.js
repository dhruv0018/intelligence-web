/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Edit Profile page module.
 * @module Edit Profile
 */
var EditProfile = angular.module('Athlete.EditProfile');

/**
 * Edit Profile controller.
 * @module Edit Profile
 * @name EditProfile.controller
 * @type {controller}
 */
EditProfile.controller('Athlete.EditProfile.controller', [
    '$scope', '$state', 'SessionService', 'Athlete.EditProfile.Data',
    function controller($scope, $state, session, data) {
        // TO-DO: Move this to somewhere more appropriate (state.onEnter?)
        $state.go('Athlete.EditProfile.BasicInfo');

        $scope.athlete = session.currentUser;

        var reader = new FileReader();

        $scope.setProfileImage = function setProfileImage(files) {
            $scope.athlete.fileImage = files[0]; // resolve $scope.athlete

            reader.readAsDataURL(files[0]);

            reader.onload = function onload() {
                $scope.athlete.imageUrl = reader.result;
                $scope.$apply();
            };
        };
    }
]);
