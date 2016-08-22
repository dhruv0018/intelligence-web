/* Fetch angular from the browser scope */
const angular = window.angular;

GeneralAllocationSettingsController.$inject = [
    '$scope',
    'AllocationSettings.Data',
    'IndexerFactory',
    'AlertsService',
    'ALLOCATION_TYPES'
];

/**
 * General Allocation Settings page controller
 */
function GeneralAllocationSettingsController(
    $scope,
    data,
    indexerFactory,
    alerts,
    ALLOCATION_TYPES
) {
    $scope.indexerGroups = data.indexerGroups.data;
    $scope.indexerGroupAllocationTypes = data.indexerGroupAllocationTypes.data;
    $scope.indexerGroupsAllocationPermissions = data.indexerGroupsAllocationPermissions;
    $scope.ALLOCATION_TYPES = ALLOCATION_TYPES;

    $scope.$on('on-sport-selected', event => {
        indexerFactory.getIndexerGroupsAllocationPermissions($scope.selectedSportId).then(response => {
            $scope.indexerGroupsAllocationPermissions.data = response.data;
            $scope.isLoadingNewSport = false;
        });
    });

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

export default GeneralAllocationSettingsController;
