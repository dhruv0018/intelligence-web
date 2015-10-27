class StyleguideCustomController {

    constructor(
        $scope,
        ARENA_TYPES
    ) {

        $scope.ARENA_TYPES = ARENA_TYPES;
        $scope.selectedArenaId = '1';
        $scope.selectedArenaType = ARENA_TYPES[$scope.selectedArenaId].type;

        //TODO find a way to use the sample data in the test folder for this at a later date
        $scope.plays = [
            {
                startTime: 5.5,
                events: [
                    {
                        time: 7
                    },
                    {
                        time: 8
                    },
                    {
                        time: 9
                    }
                ]
            },
            {
                startTime: 10,
                events: [
                    {
                        time: 11
                    },
                    {
                        time: 20
                    },
                    {
                        time: 30.5
                    }
                ]
            },
            {
                startTime: 40,
                events: [
                    {
                        time: 41
                    },
                    {
                        time: 45
                    },
                    {
                        time: 47
                    }
                ]
            }
        ];

        //mock game
        $scope.game = {
            video: {
                duration: 60
            }
        };
    }
}

StyleguideCustomController.$inject = [
    '$scope',
    'ARENA_TYPES'
];

export default StyleguideCustomController;
