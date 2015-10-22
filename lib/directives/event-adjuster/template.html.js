export default `
    <div class="event-adjuster">
        <button class="btn btn-xs btn-default btn-decrement"
                ng-disabled="decrementedTime() <= ABSOLUTE_LOWER_BOUNDARY || decrementedTime() < lowerTimeBoundary()"
                ng-click="decrement()"> - {{DELTA}} s</button>

        <span class="event-time"> {{event.time | time: true}} </span>

        <button class="btn btn-xs btn-default btn-increment"
                ng-disabled="incrementedTime() >= ABSOLUTE_UPPER_BOUNDARY || incrementedTime() > upperTimeBoundary()"
                ng-click="increment()"> + {{DELTA}} s</button>
    </div>
`;
