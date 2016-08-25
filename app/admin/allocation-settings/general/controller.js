/* Fetch angular from the browser scope */
const angular = window.angular;

GeneralAllocationSettingsController.$inject = [
    '$scope',
    'AllocationSettings.Data',
    'IndexerFactory',
    'AlertsService'
];

/**
 * General Allocation Settings page controller
 */
function GeneralAllocationSettingsController(
    $scope,
    data,
    indexerFactory,
    alerts
) {

    $scope.toggleGroupPermission = function(indexerGroup, allocationTypeId) {
        if($scope.indexerPercentage[indexerGroup.attributes.name] && $scope.groupHasPermission(indexerGroup, allocationTypeId)){
            alerts.add({
                type: 'danger',
                message: 'Update can not be saved. Please adjust weekly allocation % before removing permission from indexer group(s)'
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
