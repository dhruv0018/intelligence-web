export default `

        <input type="button"
                value=" - {{DELTA}} s"
                ng-disabled="decrementedTime() < lowerTimeBoundary()"
                ng-click="decrement($event)">

        <span class="time"> {{event.time | time: true}} </span>

        <input  type="button"
                value="+ {{DELTA}} s"
                ng-disabled="event.time >= ABSOLUTE_UPPER_BOUNDARY || (upperTimeBoundary() && incrementedTime() > upperTimeBoundary())"
                ng-click="increment()">
`;
