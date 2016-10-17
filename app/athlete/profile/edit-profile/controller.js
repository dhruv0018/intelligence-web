/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* Edit Profile dependencies
*/
AthleteProfileEditProfileController.$inject = [
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
function AthleteProfileEditProfileController (
    $scope,
    $state,
    users,
    session,
    data
) {
    $scope.athlete = session.getCurrentUser();
}


export default AthleteProfileEditProfileController;
