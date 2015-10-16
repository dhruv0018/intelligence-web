import EventList from '../../../src/collections/eventList';
import PlayList from '../../../src/collections/playList';

const Mousetrap = window.Mousetrap;

EventAdjusterController.$inject = [
    '$scope'
];

function EventAdjusterController(
    $scope
) {
    //increment or decrement by x amount of seconds
    const DELTA = 1;
    $scope.DELTA = DELTA;

    $scope.$watch('play', function() {
        let playList = new PlayList($scope.plays);
        //FIXME get some help finding the broken reference in play manager one day
        for (let play of playList) {
            if ($scope.play === play.value) {
                playList.playIterator.current = play.value;
            }
        }
        $scope.playLowerTimeBoundary = Math.ceil(playList.lowerBoundingTime());
    });

    $scope.$watch('event', () => {
        let eventList = new EventList($scope.events);

        //FIXME get some help finding the broken reference in event manager one day
        for (let event of eventList) {
            if ($scope.event === event.value) {
                eventList.eventIterator.current = event.value;
            }
        }

        $scope.eventUpperTimeBoundary = Math.floor(eventList.upperBoundingTime());
        $scope.eventLowerTimeBoundary = Math.ceil(eventList.lowerBoundingTime());
    });

    //_ key
    Mousetrap.bind('shift+-', ()=> {
        $scope.decrement();
        $scope.$apply();
    });

    //+key
    Mousetrap.bind('shift+=', ()=> {
        $scope.increment();
        $scope.$apply();
    });

    $scope.decrement = () => {
        //round down to zero if the event time goes negative
        if ($scope.event.time < 0) {
            $scope.event.time = 0;
        }

        $scope.lowerTimeBoundary = $scope.eventLowerTimeBoundary || $scope.playLowerTimeBoundary;

        if ($scope.lowerTimeBoundary && ($scope.event.time - DELTA < $scope.lowerTimeBoundary) ) {
            $scope.event.time = $scope.lowerTimeBoundary;
        } else {
            $scope.event.time = $scope.event.time - DELTA;
        }
    };

    $scope.increment= () => {
        //round the event time to the video duration if it exceeds it
        if ($scope.event.time >= $scope.video.duration) {
            $scope.event.time = $scope.video.duration;
        }

        $scope.upperTimeBoundary = $scope.eventUpperTimeBoundary;

        if ($scope.upperTimeBoundary && ($scope.event.time + DELTA > $scope.upperTimeBoundary) ) {
            $scope.event.time = $scope.upperTimeBoundary;
        } else {
            $scope.event.time = $scope.event.time + DELTA;
        }
    };

    $scope.$on('$destroy', () => {
        //_ key
        Mousetrap.unbind('shift+-');
        //+key
        Mousetrap.unbind('shift+=');
    });
}

export default EventAdjusterController;
