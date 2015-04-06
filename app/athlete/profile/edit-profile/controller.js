/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Edit Profile page module.
 * @module Edit Profile
 */
var EditProfile = angular.module('Athlete.Profile.EditProfile');

/*
* Edit Profile dependencies
*/
EditProfileController.$inject = [
    '$scope',
    '$state',
    'UsersFactory',
    'SessionService',
    'Athlete.Profile.EditProfile.Data'
];

/**
 * Edit Profile controller.
 * @module Edit Profile
 * @name EditProfile.controller
 * @type {controller}
 */
function EditProfileController (
    $scope,
    $state,
    users,
    session,
    data
) {
    // TO-DO: Move this to somewhere more appropriate (state.onEnter?)
    $state.go('Athlete.Profile.EditProfile.BasicInfo');

    $scope.athlete = session.getCurrentUser();
}

EditProfile.controller('Athlete.Profile.EditProfile.controller', EditProfileController);

export default EditProfileController;
