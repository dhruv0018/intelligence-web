/* Fetch angular from the browser scope */
const angular = window.angular;

controller.$inject = [
    '$scope',
    'GAME_STATUSES',
    'LABELS',
    'LABELS_IDS',
    'PRIORITIES',
    'SelectIndexer.Modal'
];

function controller (
    $scope,
    GAME_STATUSES,
    LABELS,
    LABELS_IDS,
    PRIORITIES,
    SelectIndexerModal
) {

    $scope.GAME_STATUSES      = GAME_STATUSES;
    $scope.SelectIndexerModal = SelectIndexerModal;
    $scope.LABELS = LABELS;
    $scope.LABELS_IDS = LABELS_IDS;
    $scope.PRIORITIES = PRIORITIES;
}

export default controller;
