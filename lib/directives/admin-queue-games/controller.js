const moment = require('moment');
const angular = window.angular;

controller.$inject = [
    '$scope',
    'GAME_STATUSES',
    'PRIORITIES',
    'LABELS',
    'LABELS_IDS',
    'SelectIndexer.Modal'
];

function controller (
    $scope,
    GAME_STATUSES,
    PRIORITIES,
    LABELS,
    LABELS_IDS,
    SelectIndexerModal
) {

    $scope.GAME_STATUSES      = GAME_STATUSES;
    $scope.SelectIndexerModal = SelectIndexerModal;
    $scope.PRIORITIES = PRIORITIES;
    $scope.LABELS = LABELS;
    $scope.LABELS_IDS = LABELS_IDS;

    $scope.timeRemaining = game => {

        return game.timeRemaining();
    };
}

export default controller;
