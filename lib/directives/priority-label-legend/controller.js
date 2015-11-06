const dependencies = [
    '$scope',
    'PRIORITIES',
    'PRIORITY_LIST',
    'LABELS'
];

const PriorityLabelLegendController = (
    $scope,
    PRIORITIES,
    PRIORITY_LIST,
    LABELS
) => {

    $scope.PRIORITIES = PRIORITIES;
    $scope.PRIORITY_LIST = PRIORITY_LIST;
    $scope.LABELS = LABELS;
};

PriorityLabelLegendController.$inject = dependencies;

export default PriorityLabelLegendController;
