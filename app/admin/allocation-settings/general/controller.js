/* Fetch angular from the browser scope */
const angular = window.angular;

GeneralAllocationSettingsController.$inject = [
    '$scope',
    'AllocationSettings.Data',
    'IndexerFactory',
    'ALLOCATION_TYPES'
];

/**
 * General Allocation Settings page controller
 */
function GeneralAllocationSettingsController(
    $scope,
    data,
    indexerFactory,
    ALLOCATION_TYPES
) {
    $scope.indexerGroups = data.indexerGroups;
    $scope.indexerGroupAllocationTypes = data.indexerGroupAllocationTypes;
    $scope.indexerGroupsAllocationPermissions = data.indexerGroupsAllocationPermissions;
    console.log($scope.indexerGroupsAllocationPermissions);
    $scope.ALLOCATION_TYPES = ALLOCATION_TYPES;

    $scope.$on('update-selected-sport', (event, selectedSport) => {
        indexerFactory.getIndexerGroupsAllocationPermissions(selectedSport.id).then(response => {
            $scope.indexerGroupsAllocationPermissions = response.data;
            console.log($scope.indexerGroupsAllocationPermissions);
        });
    });

    $scope.groupHasPermission = function(indexerGroup, allocationTypeId) {

    };

    $scope.toggleGroupPermission = function(indexerGroup, allocationTypeId) {

    };
}

export default GeneralAllocationSettingsController;
