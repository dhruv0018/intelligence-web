/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Physical page module.
 * @module EditProfile.Physical
 */
var Physical = angular.module('Athlete.Profile.EditProfile.Physical');

/*
* EditProfile.Physical dependencies
*/
physicalController.$inject = [
    '$scope',
    'UsersFactory',
    'SessionService',
    'Athlete.Profile.EditProfile.Data'
];

/**
 * EditProfile.Physical controller.
 * @module EditProfile.Physical
 * @name EditProfile.Physical.controller
 * @type {controller}
 */
function physicalController (
    $scope,
    users,
    session,
    data
) {
    $scope.athlete = session.getCurrentUser();

    //display height as temporary feet and inches variables
    $scope.athleteHeightFeet = Math.floor($scope.athlete.profile.height / 12);
    $scope.athleteHeightInches = $scope.athlete.profile.height % 12;

    $scope.savePhysical = function savePhysical() {
        //recombine feet and inches before saving
        $scope.athlete.profile.height = Number($scope.athleteHeightFeet * 12) + Number($scope.athleteHeightInches);
        $scope.athlete.save();
    };
}

Physical.controller('Athlete.Profile.EditProfile.Physical.controller', physicalController);

export default physicalController;
