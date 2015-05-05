/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * EditProfile.Physical page module.
 * @module EditProfile.Physical
 */
const Physical = angular.module('Athlete.Profile.EditProfile.Physical');

/*
* EditProfile.Physical dependencies
*/
PhysicalController.$inject = [
    '$scope',
    '$timeout',
    '$filter',
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
    $filter,
    users,
    session,
    data
) {
    $scope.athlete = session.getCurrentUser();

    $scope.isSaving = false;
    $scope.confirmSave = false;

    if ($scope.athlete.profile.dominantHandType === null) {
        $scope.athlete.profile.dominantHandType = '';
    }

    //display height and wingspan as temporary feet and inches variables
    if ($scope.athlete.profile.height) {
        $scope.athleteHeightFeet = $filter('inchesAsFeet')($scope.athlete.profile.height);
        $scope.athleteHeightInches = $filter('remainingInchesFromFeetConversion')($scope.athlete.profile.height);
    }

    if ($scope.athlete.profile.wingspan) {
        $scope.athleteWingFeet = $filter('inchesAsFeet')($scope.athlete.profile.wingspan);
        $scope.athleteWingInches = $filter('remainingInchesFromFeetConversion')($scope.athlete.profile.wingspan);
    }

    //display mile times as temporary minutes and seconds variables
    if ($scope.athlete.profile.oneMileTime) {
        $scope.athleteOneMileTimeMinutes = $filter('secondsAsMinutes')($scope.athlete.profile.oneMileTime);
        $scope.athleteOneMileTimeSeconds = $filter('remainingSecondsFromMinuteConversion')($scope.athlete.profile.oneMileTime);
    }

    if ($scope.athlete.profile.threeMileTime) {
        $scope.athleteThreeMileTimeMinutes = $filter('secondsAsMinutes')($scope.athlete.profile.oneMileTime);
        $scope.athleteThreeMileTimeSeconds = $filter('remainingSecondsFromMinuteConversion')($scope.athlete.profile.threeMileTime);
    }

    $scope.savePhysical = function savePhysical() {
        $scope.isSaving = true;

        if ($scope.athlete.profile.dominantHandType === '') {
            $scope.athlete.profile.dominantHandType = null;
        }

        //recombine feet and inches before saving
        $scope.athlete.profile.height = Number($scope.athleteHeightFeet * 12) + Number($scope.athleteHeightInches);
        $scope.athlete.profile.wingspan = Number($scope.athleteWingFeet * 12) + Number($scope.athleteWingInches);
        //recombine minutes and seconds before saving
        $scope.athlete.profile.oneMileTime = Number($scope.athleteOneMileTimeMinutes * 60) + Number($scope.athleteOneMileTimeSeconds);
        $scope.athlete.profile.threeMileTime = Number($scope.athleteThreeMileTimeMinutes * 60) + Number($scope.athleteThreeMileTimeSeconds);

        // Check to make sure no 0 values get passed
        if ($scope.athlete.profile.height === 0) $scope.athlete.profile.height = null;
        if ($scope.athlete.profile.wingspan === 0) $scope.athlete.profile.wingspan = null;
        if ($scope.athlete.profile.oneMileTime === 0) $scope.athlete.profile.oneMileTime = null;
        if ($scope.athlete.profile.threeMileTime === 0) $scope.athlete.profile.threeMileTime = null;

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
