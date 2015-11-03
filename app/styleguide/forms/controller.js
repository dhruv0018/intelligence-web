function StyleguideFormsController (
    $scope,
    PRIORITIES,
    LABELS
) {

    $scope.team = {

        priority: PRIORITIES.HIGH.id,
        label: LABELS.KL.id
    };

    $scope.LABELS = LABELS;
}

StyleguideFormsController.$inject = [
    '$scope',
    'PRIORITIES',
    'LABELS'
];

export default StyleguideFormsController;
