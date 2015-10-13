export default `

    <button ng-disabled="lowerTimeBoundary >= event.time - 1"
            ng-class="{'btn-primary': lowerTimeBoundary < event.time - 1}"
            class="btn"
            ng-click="decrement()">+1s</button>

    <span class="event-time"> {{event.displayTime}} </span>

    <button ng-disabled="upperTimeBoundary <= event.time + 1"
            ng-class="{'btn-primary': upperTimeBoundary > event.time + 1}"
            class="btn"
            ng-click="increment()">-1s</button>
`;
