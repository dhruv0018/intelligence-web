export default `

    <button ng-disabled="lowerTimeBoundary >= event.time - DELTA"
            ng-class="{'btn-primary': lowerTimeBoundary < event.time - DELTA}"
            class="btn"
            ng-click="decrement()"> - {{DELTA}} s</button>

    <span class="event-time"> {{event.time | time: true}} </span>

    <button ng-disabled="upperTimeBoundary <= event.time + DELTA"
            ng-class="{'btn-primary': upperTimeBoundary > event.time + DELTA}"
            class="btn"
            ng-click="increment()"> + {{DELTA}} s</button>
`;
