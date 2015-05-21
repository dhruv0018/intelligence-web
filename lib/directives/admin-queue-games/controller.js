/* Fetch angular from the browser scope */
const angular = window.angular;

controller.$inject = [
    '$scope',
    'GAME_STATUSES'
];

function controller (
    $scope,
    GAME_STATUSES
) {

    $scope.GAME_STATUSES = GAME_STATUSES;
}

export default controller;
