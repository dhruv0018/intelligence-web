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
    $scope.DELTA = DELTA;

    $scope.$watch('play', function() {
        $scope.playList = new PlayList($scope.plays);
        $scope.playList.playIterator.current = $scope.play;
    });


    $scope.$watch('event', () => {
        $scope.eventList = new EventList($scope.events);
        $scope.eventList.eventIterator.current = $scope.event;
    });

    Mousetrap.bind('shift+-', ()=> $scope.$apply(() => $scope.decrement())); //_ key
    Mousetrap.bind('shift+=', ()=> $scope.$apply(() => $scope.increment())); //+key

    $scope.decrement = () => {
        //round down to zero if the event time goes negative
        if ($scope.event.time < 0) {
            $scope.event.time = 0;
        }

        let eventLowerTimeBoundary = Math.ceil($scope.eventList.lowerBoundingTime);
        let playLowerTimeBoundary = Math.ceil($scope.playList.lowerBoundingTime);
        $scope.lowerTimeBoundary = eventLowerTimeBoundary || playLowerTimeBoundary;

        if ($scope.lowerTimeBoundary && ($scope.event.time - DELTA < $scope.lowerTimeBoundary) ) {
            $scope.event.time = $scope.lowerTimeBoundary;
        } else {
            $scope.event.time = $scope.event.time - DELTA;
        }
        $scope.adjustVideoTime($scope.event.time);
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
        $scope.adjustVideoTime($scope.event.time);
    };

    $scope.adjustVideoTime = (time) => {
        if (videoPlayer && videoPlayer.seekTime && time) {
            videoPlayer.seekTime(time);
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
