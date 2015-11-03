function StyleguideFormsController (
    $scope,
    PRIORITIES,
    LABELS
) {

    $scope.team = {

        priority: PRIORITIES.HIGH.id,
        label: LABELS[1].id
    };

    $scope.LABELS = LABELS;
}

StyleguideFormsController.$inject = [
    '$scope',
    'PRIORITIES',
    'LABELS'
];

export default StyleguideFormsController;
