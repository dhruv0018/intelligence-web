/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* EditProfile.Academics dependencies
*/
AthleteProfileEditProfileAcademicsController.$inject = [
    '$scope',
    'UsersFactory',
    'SessionService'
];

/**
 * EditProfile.Academics controller.
 * @module EditProfile.Academics
 * @name EditProfile.Academics.controller
 * @type {controller}
 */
function AthleteProfileEditProfileAcademicsController (
    $scope,
    users,
    session
) {
    $scope.athlete = session.getCurrentUser();
}


export default AthleteProfileEditProfileAcademicsController;
