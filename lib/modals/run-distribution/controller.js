/**
 * Run Distribution controller class
 * @class RunDistribution
 */

RunDistributionContoller.$inject = [
    '$scope',
    '$modalInstance',
    'IndexerGroups'
];

function RunDistributionContoller (
    $scope,
    $modalInstance,
    indexerGroups
) {
    $scope.indexerGroups = indexerGroups;
}

export default RunDistributionContoller;
