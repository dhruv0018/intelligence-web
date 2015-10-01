const moment = require('moment');

function BasketballArenaController(
    $scope,
    ARENA_IDS,
    config
) {

    if($scope.game && $scope.game.submittedAt) {

        const indexedOnV1 = moment($scope.game.submittedAt).isBefore(config.indexingV1Date);

        if ($scope.type.indexOf(ARENA_IDS[1]) >= 0 && indexedOnV1) {

            $scope.type = ARENA_IDS[10];
        }
    }
}

BasketballArenaController.$inject = [
    '$scope',
    'ARENA_IDS',
    'config'
];

export default BasketballArenaController;
