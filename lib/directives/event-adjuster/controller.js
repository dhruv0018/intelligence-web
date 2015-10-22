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


    //FIXME These watches are temporary until we integrate the eventlist/playlist into our actual application modelling
    $scope.$watch('play', () => {
        $scope.playList = new PlayList($scope.plays);
        $scope.playList.playIterator.current = $scope.play;
    });

    $scope.$watch('event', () => {
        $scope.eventList = new EventList($scope.events);
        $scope.eventList.eventIterator.current = $scope.event;
    });

    Mousetrap.bind(DECREMENT_HOTKEY, e => {
        e.preventDefault();
        $scope.$apply(() => $scope.decrement());
    });

    Mousetrap.bind(INCREMENT_HOTKEY, e => {
        e.preventDefault();
        $scope.$apply(() => $scope.increment());
    });

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

    $scope.decrement = () => {
        let decrementedTime = $scope.decrementedTime();
        let decrementedBelowAbsolute = decrementedTime < ABSOLUTE_LOWER_BOUNDARY;
        let decrementedBelowLowerBoundary = decrementedTime < $scope.lowerTimeBoundary();

        if (decrementedBelowAbsolute) {
            $scope.event.time = ABSOLUTE_LOWER_BOUNDARY;
        } else if (decrementedBelowLowerBoundary) {
            $scope.event.time = $scope.lowerTimeBoundary();
        } else {
            $scope.event.time = decrementedTime;
        }

        if ($scope.event === $scope.eventList.first) {
            $scope.play.startTime = $scope.event.time;
        }
        videoPlayer.seekTime($scope.event.time);
    };

    $scope.upperTimeBoundary = () => {
        let currentTime = $scope.event.time;
        let eventUpperTimeBoundary = Math.floor($scope.eventList.upperBoundingTime);
        return eventUpperTimeBoundary;
    };

    $scope.incrementedTime = () => {
        let time = $scope.event.time;
        return time + DELTA;
    };

    $scope.increment = () => {
        let incrementedTime = $scope.incrementedTime();
        let incrementedAboveAbsolute = incrementedTime > ABSOLUTE_UPPER_BOUNDARY;
        let incrementedAboveUpperBoundary = incrementedTime > $scope.upperTimeBoundary();

        if (incrementedAboveAbsolute) {
            $scope.event.time = ABSOLUTE_UPPER_BOUNDARY;
        } else if (incrementedAboveUpperBoundary) {
            $scope.event.time = $scope.upperTimeBoundary();
        } else {
            $scope.event.time = incrementedTime;
        }

        if ($scope.event === $scope.eventList.last) {
            $scope.play.endTime = $scope.event.time;
        }
        videoPlayer.seekTime($scope.event.time);
    };

    $scope.$on('$destroy', () => {
        Mousetrap.unbind(DECREMENT_HOTKEY);
        Mousetrap.unbind(INCREMENT_HOTKEY);
    });
}

export default EventAdjusterController;
