/* Fetch angular from the browser scope */
const angular = window.angular;

controller.$inject = [
    '$scope',
    'GAME_STATUSES',
    'SelectIndexer.Modal'
];

function controller (
    $scope,
    GAME_STATUSES,
    SelectIndexerModal
) {

    $scope.GAME_STATUSES      = GAME_STATUSES;
    $scope.SelectIndexerModal = SelectIndexerModal;
}

export default controller;
