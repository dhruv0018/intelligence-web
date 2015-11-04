const dependencies = [
    '$scope',
    'PRIORITIES'
];

const PriorityLabelIconController = (
    $scope,
    PRIORITIES
) => {

    $scope.PRIORITIES = PRIORITIES;
};

PriorityLabelIconController.$inject = dependencies;

export default PriorityLabelIconController;
