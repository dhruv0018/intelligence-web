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
PhysicalController.$inject = [
    '$scope',
    '$timeout',
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
function PhysicalController (
    $scope,
    $timeout,
    users,
    session,
    data
) {
    $scope.athlete = session.getCurrentUser();

    $scope.isSaving = false;
    $scope.confirmSave = false;

    //display height and wingspan as temporary feet and inches variables
    $scope.athleteHeightFeet = getFeet($scope.athlete.profile.height);
    $scope.athleteHeightInches = getInches($scope.athlete.profile.height);
    $scope.athleteWingFeet = getFeet($scope.athlete.profile.wingspan);
    $scope.athleteWingInches = getInches($scope.athlete.profile.wingspan);

    //display mile times as temporary minutes and seconds variables
    $scope.athleteOneMileTimeMinutes = getMinutes($scope.athlete.profile.oneMileTime);
    $scope.athleteOneMileTimeSeconds = getSeconds($scope.athlete.profile.oneMileTime);
    $scope.athleteThreeMileTimeMinutes = getMinutes($scope.athlete.profile.threeMileTime);
    $scope.athleteThreeMileTimeSeconds = getSeconds($scope.athlete.profile.threeMileTime);

    function getFeet(measurement) {
        return Math.floor(measurement / 12);
    }

    function getInches(measurement) {
        return measurement % 12;
    }

    function getMinutes(measurement) {
        return Math.floor(measurement / 60);
    }

    function getSeconds(measurement) {
        return measurement % 60;
    }

    $scope.savePhysical = function savePhysical() {
        $scope.isSaving = true;

        //recombine feet and inches before saving
        $scope.athlete.profile.height = Number($scope.athleteHeightFeet * 12) + Number($scope.athleteHeightInches);
        $scope.athlete.profile.wingspan = Number($scope.athleteWingFeet * 12) + Number($scope.athleteWingInches);
        //recombine minutes and seconds before saving
        $scope.athlete.profile.oneMileTime = Number($scope.athleteOneMileTimeMinutes * 60) + Number($scope.athleteOneMileTimeSeconds);
        $scope.athlete.profile.threeMileTime = Number($scope.athleteThreeMileTimeMinutes * 60) + Number($scope.athleteThreeMileTimeSeconds);

        $scope.athlete.save().then(function saveConfirmation() {
            $timeout(function() {
                $scope.confirmSave = true;
            }, 1000);
            $timeout(function() {
                $scope.isSaving = false;
                $scope.confirmSave = false;
            }, 2000);
        });
    };
}

Physical.controller('Athlete.Profile.EditProfile.Physical.controller', PhysicalController);

export default PhysicalController;
