export default `
    <div class="event-adjuster">
        <button class="btn btn-xs btn-default btn-decrement" ng-disabled="lowerTimeBoundary && event.time <= lowerTimeBoundary || event.time <= 0" ng-click="decrement()"> - {{DELTA}} s</button>

        <span class="event-time"> {{event.time | time: true}} </span>

        <button class="btn btn-xs btn-default btn-increment" ng-disabled="upperTimeBoundary && event.time >= upperTimeBoundary || event.time >= video.duration" ng-click="increment()"> + {{DELTA}} s</button>
    </div>
`;
