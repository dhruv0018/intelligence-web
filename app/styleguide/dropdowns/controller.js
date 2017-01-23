function StyleguideDropdownsController (
    $scope,
    PRIORITIES
) {

    $scope.PRIORITIES = PRIORITIES;
}

StyleguideDropdownsController.$inject = [
    '$scope',
    'PRIORITIES'
];

export default StyleguideDropdownsController;
