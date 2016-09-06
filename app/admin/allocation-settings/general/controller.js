/* Fetch angular from the browser scope */
const angular = window.angular;

GeneralAllocationSettingsController.$inject = [
    '$scope',
    '$rootScope',
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
    $rootScope,
    data,
    indexerFactory,
    alerts,
    ALLOCATION_TYPES
) {

    $scope.toggleGroupPermission = function(indexerGroup, allocationTypeId) {
        if($scope.indexerPercentage[indexerGroup.attributes.name] && (allocationTypeId == ALLOCATION_TYPES.PRIORITY_NORMAL.id) && $scope.groupHasPermission(indexerGroup, allocationTypeId)){
            alerts.add({
                type: 'danger',
                message: 'Please adjust weekly allocation % before removing permission from indexer group(s)'
            });

            return;
        }
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
        $scope.$parent.frmGeneralChanged = true;
        $scope.frmGeneral.$setDirty();
    };

    $scope.saveGroupPermissions = function() {
        $scope.preSaving = true;
        indexerFactory.updateIndexerGroupsAllocationPermissions($scope.indexerGroupsAllocationPermissions).then(response => {
            alerts.add({
                type: 'success',
                message: 'Permissions saved successfully!'
            });
            $scope.$parent.frmGeneralChanged = false;
            $scope.preSaving = false;
            $scope.frmGeneral.$setPristine();
        });
    };

}

export default GeneralAllocationSettingsController;
