/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Edit Profile page module.
 * @module Edit Profile
 */
const EditProfile = angular.module('Athlete.Profile.EditProfile');

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
    $scope.athlete = session.getCurrentUser();
}

EditProfile.controller('Athlete.Profile.EditProfile.controller', EditProfileController);

export default EditProfileController;
