/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Physical page module.
 * @module EditProfile.Physical
 */
var Physical = angular.module('Athlete.EditProfile.Physical');

/**
 * EditProfile.Physical controller.
 * @module EditProfile.Physical
 * @name EditProfile.Physical.controller
 * @type {controller}
 */
Physical.controller('Athlete.EditProfile.Physical.controller', [
    '$scope', 'Utilities', 'Athlete.EditProfile.Data',
    function controller($scope, utilities, data) {
        $scope.utilities = utilities;
        $scope.athlete = data.athlete;

        //display height as temporary feet and inches variables
        $scope.athleteHeightFeet = utilities.floor($scope.athlete.profile.height / 12);
        $scope.athleteHeightInches = $scope.athlete.profile.height % 12;
        //$scope.athleteHeightFeet = 6;
        //$scope.athleteHeightInches = 4;
    }
]);
