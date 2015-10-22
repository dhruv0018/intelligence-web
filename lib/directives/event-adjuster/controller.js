import EventList from '../../../src/collections/eventList';
import PlayList from '../../../src/collections/playList';

const Mousetrap = window.Mousetrap;

EventAdjusterController.$inject = [
    '$scope',
    'VideoPlayer'
];

function EventAdjusterController(
    $scope,
    videoPlayer
) {
    //increment or decrement by x amount of seconds
    const DELTA = 1;
    const DECREMENT_HOTKEY = 'down';
    const INCREMENT_HOTKEY = 'up';
    const ABSOLUTE_LOWER_BOUNDARY = 0;
    const ABSOLUTE_UPPER_BOUNDARY = $scope.video.duration;
    $scope.ABSOLUTE_LOWER_BOUNDARY = ABSOLUTE_LOWER_BOUNDARY;
    $scope.ABSOLUTE_UPPER_BOUNDARY = ABSOLUTE_UPPER_BOUNDARY;
    $scope.DELTA = DELTA;

    $scope.$watch('play', function() {
        $scope.playList = new PlayList($scope.plays);
        $scope.playList.playIterator.current = $scope.play;
    });


    $scope.$watch('event', () => {
        $scope.eventList = new EventList($scope.events);
        $scope.eventList.eventIterator.current = $scope.event;
    });

    Mousetrap.bind(DECREMENT_HOTKEY, ()=> $scope.$apply(() => $scope.decrement()));
    Mousetrap.bind(INCREMENT_HOTKEY, ()=> $scope.$apply(() => $scope.increment()));

    //FIXME this can theoretically be moved into playlist once it actually has a list of events
    $scope.lowerTimeBoundary = () => {
        let currentTime = $scope.event.time;
        let eventLowerTimeBoundary = Math.ceil($scope.eventList.lowerBoundingTime);
        let playLowerTimeBoundary = Math.ceil($scope.playList.lowerBoundingTime);
        let lowerTimeBoundary = eventLowerTimeBoundary || playLowerTimeBoundary;
        return lowerTimeBoundary;
    };

    $scope.decrementedTime = () => {
        let time = $scope.event.time;
        return time - DELTA;
    };

    $scope.decrement = (e) => {
        let decrementedTime = $scope.decrementedTime();
        let decrementedBelowAbsolute = decrementedTime < ABSOLUTE_LOWER_BOUNDARY;
        let decrementedBelowLowerBoundary = decrementedTime < $scope.lowerTimeBoundary();

        if (decrementedBelowAbsolute) {
            $scope.event.time = ABSOLUTE_UPPER_BOUNDARY;
        } else if (decrementedBelowLowerBoundary) {
            $scope.event.time = $scope.lowerTimeBoundary();
        } else {
            $scope.event.time = decrementedTime;
        }
        videoPlayer.seekTime($scope.event.time);
    };

    $scope.increment = () => {
        //round the event time to the video duration if it exceeds it
        if ($scope.event.time >= $scope.video.duration) {
            $scope.event.time = $scope.video.duration;
        }

        let eventUpperTimeBoundary = Math.floor($scope.eventList.upperBoundingTime);
        $scope.upperTimeBoundary = eventUpperTimeBoundary;

        if ($scope.upperTimeBoundary && ($scope.event.time + DELTA > $scope.upperTimeBoundary) ) {
            $scope.event.time = $scope.upperTimeBoundary;
        } else {
            $scope.event.time = $scope.event.time + DELTA;
        }
        videoPlayer.seekTime($scope.event.time);
    };

    $scope.$on('$destroy', () => {
        Mousetrap.unbind(DECREMENT_HOTKEY);
        Mousetrap.unbind(INCREMENT_HOTKEY);
    });
}

export default EventAdjusterController;
