class StyleguideCustomController {

    constructor(
        $scope,
        ARENA_TYPES
    ) {

        $scope.ARENA_TYPES = ARENA_TYPES;
        $scope.selectedArenaId = '1';
        $scope.selectedArenaType = ARENA_TYPES[$scope.selectedArenaId].type;

        //Event Time Adjustmentss
        $scope.events = [
            {
                time: 30,
                get displayTime() {
                    return displayTime(this.time);
                }
            },
            {
                time: 20,
                get displayTime() {
                    return displayTime(this.time);
                }
            },
            {
                time: 10,
                get displayTime() {
                    return displayTime(this.time);
                }
            }
        ];

        function displayTime(seconds) {
            const h = 3600;
            const m = 60;
            let hours = Math.floor(seconds/h);
            let minutes = Math.floor( (seconds % h)/m );
            let scnds = Math.floor( (seconds % m) );
            let timeString = '';
            if(scnds < 10) scnds = '0'+scnds;
            if(hours < 10) hours = '0'+hours;
            if(minutes < 10) minutes = '0'+minutes;
            timeString = hours +':'+ minutes +':'+scnds;
            return timeString;
        }

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
