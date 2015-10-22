export default `
        <button ng-disabled="decrementedTime() <= ABSOLUTE_LOWER_BOUNDARY || decrementedTime() < lowerTimeBoundary()"
                ng-click="decrement()"> - {{DELTA}} s</button>

        <span class="__time"> {{event.time | time: true}} </span>

        <button ng-disabled="incrementedTime() >= ABSOLUTE_UPPER_BOUNDARY || (upperTimeBoundary() && incrementedTime() > upperTimeBoundary())"
                ng-click="increment()"> + {{DELTA}} s</button>
`;
