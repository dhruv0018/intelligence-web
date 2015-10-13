class StyleguideCustomController {

    constructor(
        $scope,
        ARENA_TYPES
    ) {

        $scope.ARENA_TYPES = ARENA_TYPES;
        $scope.selectedArenaId = '1';
        $scope.selectedArenaType = ARENA_TYPES[$scope.selectedArenaId].type;

        //Event Time Adjustments
        $scope.events = [
            {
                time: 10.5
            },
            {
                time: 20
            },
            {
                time: 30.5
            }
        ];

        //mock game
        $scope.game = {
            video: {
                duration: 40
            }
        };
    }
}

StyleguideCustomController.$inject = [
    '$scope',
    'ARENA_TYPES'
];

export default StyleguideCustomController;
