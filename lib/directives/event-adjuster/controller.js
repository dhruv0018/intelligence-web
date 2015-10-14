import EventList from '../../../src/collections/eventList';
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

    let eventList = new EventList($scope.events);
    eventList.eventIterator.current = $scope.event;
    $scope.upperTimeBoundary = Math.floor(eventList.upperBoundingTime());
    $scope.lowerTimeBoundary = Math.ceil(eventList.lowerBoundingTime());

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
