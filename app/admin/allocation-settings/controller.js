/* Fetch angular from the browser scope */
const angular = window.angular;

AllocationSettingsController.$inject = [
    '$scope',
    'AllocationSettings.Data',
    'SportsFactory'
];

/**
 * Allocation Settings page controller
 */
function AllocationSettingsController(
    $scope,
    data,
    sports
) {
    $scope.sports = sports.getList();

    $scope.selectedSportId = $scope.sports[0].id;
    $scope.isLoadingNewSport = false;

    $scope.onChangeSelectedSportId = function() {
        $scope.isLoadingNewSport = true;
        $scope.$broadcast('on-sport-selected', event);
    };

}

export default AllocationSettingsController;
