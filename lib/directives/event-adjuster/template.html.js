export default `
        <button ng-disabled="decrementedTime() < lowerTimeBoundary()"
                ng-click="decrement()"> - {{DELTA}} s</button>

        <span class="time"> {{event.time | time: true}} </span>

        <button ng-disabled="event.time >= ABSOLUTE_UPPER_BOUNDARY || (upperTimeBoundary() && incrementedTime() > upperTimeBoundary())"
                ng-click="increment()"> + {{DELTA}} s</button>
`;
