const dependencies = [
    '$scope',
    'PRIORITIES',
    'LABELS'
];

const PriorityLabelLegendController = (
    $scope,
    PRIORITIES,
    LABELS
) => {

    $scope.PRIORITIES = PRIORITIES;
    $scope.LABELS = LABELS;
};

PriorityLabelLegendController.$inject = dependencies;

export default PriorityLabelLegendController;
