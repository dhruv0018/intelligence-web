/* Fetch angular from the browser scope */
const angular = window.angular;

AllocationSettingsController.$inject = [
    '$scope',
    'AllocationSettings.Data',
    'SportsFactory',
    'ALLOCATION_TYPES'
];

/**
 * Allocation Settings page controller
 */
function AllocationSettingsController(
    $scope,
    data,
    sports,
    ALLOCATION_TYPES
) {
    $scope.ALLOCATION_TYPES = ALLOCATION_TYPES;
    $scope.sports = sports.getList();

    $scope.selectedSportId = $scope.sports[0].id;
    $scope.isLoadingNewSport = false;

    $scope.onChangeSelectedSportId = function() {
        $scope.isLoadingNewSport = true;
        $scope.$broadcast('on-sport-selected', event);
    };

    $scope.groupHasPermission = function(indexerGroup, allocationTypeId) {
        if(typeof indexerGroup === 'object'){
            indexerGroup = indexerGroup.attributes.name;
        }

        return data.indexerGroupsAllocationPermissions.data.some(permission => {
            if (permission.attributes.name === indexerGroup && permission.attributes.sports[$scope.selectedSportId]) {
                return permission.attributes.sports[$scope.selectedSportId].some(permissionId => {
                    return permissionId === allocationTypeId;
                });
            }
        });
    };
}

export default AllocationSettingsController;
