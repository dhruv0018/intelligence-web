/* Fetch angular from the browser scope */
const angular = window.angular;

AllocationSettingsController.$inject = [
    '$scope',
    'AllocationSettings.Data',
    'IndexerFactory',
    'SportsFactory',
    'AlertsService',
    'ALLOCATION_TYPES'
];

/**
 * Allocation Settings page controller
 */
function AllocationSettingsController(
    $scope,
    data,
    indexerFactory,
    sports,
    alerts,
    ALLOCATION_TYPES
) {
    $scope.sports = sports.getList();
    $scope.selectedSportId = $scope.sports[0].id;
    $scope.isLoadingNewSport = false;

    //For General Settings
    $scope.indexerGroups = data.indexerGroups.data;
    $scope.indexerGroupAllocationTypes = data.indexerGroupAllocationTypes.data;
    $scope.indexerGroupsAllocationPermissions = data.indexerGroupsAllocationPermissions;
    $scope.ALLOCATION_TYPES = ALLOCATION_TYPES;

    $scope.onChangeSelectedSportId = function() {
        $scope.isLoadingNewSport = true;
        indexerFactory.getIndexerGroupsAllocationPermissions($scope.selectedSportId).then(response => {
            $scope.indexerGroupsAllocationPermissions.data = response.data;
            $scope.isLoadingNewSport = false;
        });
    };

    $scope.groupHasPermission = function(indexerGroup, allocationTypeId) {
        return $scope.indexerGroupsAllocationPermissions.data.some(permission => {
            if (permission.attributes.name === indexerGroup.attributes.name && permission.attributes.sports[$scope.selectedSportId]) {
                return permission.attributes.sports[$scope.selectedSportId].some(permissionId => {
                    return permissionId === allocationTypeId;
                });
            }
        });
    };

    $scope.toggleGroupPermission = function(indexerGroup, allocationTypeId) {
        if ($scope.groupHasPermission(indexerGroup, allocationTypeId)) {
            $scope.indexerGroupsAllocationPermissions.data.forEach(permission => {
                if (permission.attributes.name === indexerGroup.attributes.name) {
                    let index = permission.attributes.sports[$scope.selectedSportId].indexOf(allocationTypeId);
                    permission.attributes.sports[$scope.selectedSportId].splice(index, 1);
                }
            });
        } else {
            $scope.indexerGroupsAllocationPermissions.data.forEach(permission => {
                if (permission.attributes.name === indexerGroup.attributes.name) {
                    if (permission.attributes.sports[$scope.selectedSportId]) {
                        permission.attributes.sports[$scope.selectedSportId].push(allocationTypeId);
                    } else {
                        permission.attributes.sports = {[$scope.selectedSportId]: [allocationTypeId]};
                    }
                }
            });
        }
    };

    $scope.saveGroupPermissions = function() {
        indexerFactory.updateIndexerGroupsAllocationPermissions($scope.indexerGroupsAllocationPermissions).then(response => {
            alerts.add({
                type: 'success',
                message: 'Permissions saved successfully!'
            });
        });
    };
}

export default AllocationSettingsController;
