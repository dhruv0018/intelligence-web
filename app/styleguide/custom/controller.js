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
                time: 3800
            },
            {
                time: 3700
            },
            {
                time: 3599
            }
        ];

        //mock game
        $scope.game = {
            video: {
                duration: 4000
            }
        };
    }
}

StyleguideCustomController.$inject = [
    '$scope',
    'ARENA_TYPES'
];

export default StyleguideCustomController;
