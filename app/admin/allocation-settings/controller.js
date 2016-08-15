/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

AllocationSettingsController.$inject = [
    '$scope',
    'SportsFactory'
];

/**
 * Allocation Settings page controller
 */
function AllocationSettingsController(
    $scope,
    sports
) {
    $scope.sports = sports.getList();
    $scope.selectedSport = $scope.sports[0];
}

export default AllocationSettingsController;
