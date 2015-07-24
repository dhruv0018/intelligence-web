/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * EditProfile.Academics page module.
 * @module EditProfile.Academics
 */
const Academics = angular.module('Athlete.Profile.EditProfile.Academics');

/*
* EditProfile.Academics dependencies
*/
AcademicsController.$inject = [
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
function AcademicsController (
    $scope,
    users,
    session
) {
    $scope.athlete = session.getCurrentUser();
}

Academics.controller('Athlete.Profile.EditProfile.Academics.controller', AcademicsController);

export default AcademicsController;
