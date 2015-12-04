const dependencies = [
    '$scope',
    'PRIORITIES'
];

/**
 * @param {Object} $scope - Angular $scope
 * @param {Object} PRIORITIES - PRIORITIES constant
 */
const KrossoverPrioritySelectController = (
    $scope,
    PRIORITIES
) => {

    $scope.PRIORITIES = PRIORITIES;
};

KrossoverPrioritySelectController.$inject = dependencies;

export default KrossoverPrioritySelectController;
