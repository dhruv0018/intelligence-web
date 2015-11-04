const dependencies = [
    '$scope',
    'PRIORITIES'
];

const KrossoverPriorityLabelIconController = (
    $scope,
    PRIORITIES
) => {

    $scope.PRIORITIES = PRIORITIES;
};

KrossoverPriorityLabelIconController.$inject = dependencies;

export default KrossoverPriorityLabelIconController;
