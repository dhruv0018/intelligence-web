/* Fetch angular from the browser scope */
const angular = window.angular;

controller.$inject = [
    '$scope',
    'GAME_STATUSES',
    'LABELS',
    'LABELS_IDS',
    'SelectIndexer.Modal'
];

function controller (
    $scope,
    GAME_STATUSES,
    LABELS,
    LABELS_IDS,
    SelectIndexerModal
) {

    $scope.GAME_STATUSES      = GAME_STATUSES;
    $scope.SelectIndexerModal = SelectIndexerModal;
    $scope.LABELS = LABELS;
    $scope.LABELS_IDS = LABELS_IDS;
}

export default controller;
