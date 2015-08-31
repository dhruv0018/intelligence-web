class StyleguideCustomController {

    constructor(
        $scope,
        ARENA_TYPES
    ) {

        $scope.ARENA_TYPES = ARENA_TYPES;
        $scope.selectedArenaId = '1';
        $scope.selectedArenaType = ARENA_TYPES[$scope.selectedArenaId].type;
    }
}

StyleguideCustomController.$inject = [
    '$scope',
    'ARENA_TYPES'
];

export default StyleguideCustomController;
