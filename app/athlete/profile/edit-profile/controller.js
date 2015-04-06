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
editProfileController.$inject = [
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
function editProfileController (
    $scope,
    $state,
    users,
    session,
    data
) {
    $scope.athlete = session.getCurrentUser();
}

EditProfile.controller('Athlete.Profile.EditProfile.controller', editProfileController);

export default editProfileController;
