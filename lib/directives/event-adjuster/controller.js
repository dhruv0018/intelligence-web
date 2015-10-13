import EventList from '../../../src/collections/eventList';

EventAdjusterController.$inject = [
    '$scope'
];

function EventAdjusterController(
    $scope
) {

    let eventList = new EventList($scope.events);
    eventList.eventIterator.current = $scope.event;
    $scope.upperTimeBoundary = eventList.upperBoundingTime();
    $scope.lowerTimeBoundary = eventList.lowerBoundingTime();

    $scope.decrement = () => {
        //round down to zero if the event time goes negative
        if ($scope.event.time < 0) {
            $scope.event.time = 0;
        }

        if ($scope.lowerTimeBoundary && $scope.event.time - 1 < $scope.lowerTimeBoundary) {
            $scope.event.time = $scope.lowerTimeBoundary;
        } else {
            $scope.event.time--;
        }

        console.log('decrement: ', $scope.event.time);
    };

    $scope.increment= () => {
        //round the event time to the video duration if it exceeds it
        if ($scope.event.time >= $scope.video.duration) {
            $scope.event.time = $scope.video.duration;
        }

        if ($scope.upperTimeBoundary && $scope.event.time + 1 > $scope.upperTimeBoundary) {
            $scope.event.time = $scope.upperTimeBoundary;
        } else {
            $scope.event.time++;
        }
        console.log('increment: ', $scope.event.time);
    };
}

export default EventAdjusterController;
