function StyleguideButtonsController (
    $scope,
    PRIORITIES
) {

    $scope.PRIORITIES = PRIORITIES;
}

StyleguideButtonsController.$inject = [
    '$scope',
    'PRIORITIES'
];

export default StyleguideButtonsController;
