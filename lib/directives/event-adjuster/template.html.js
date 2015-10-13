export default `

    <button class="btn btn-default" ng-click="decrement()"> - {{DELTA}} s</button>

    <span class="event-time"> {{event.time | time: true}} </span>

    <button class="btn btn-default" ng-click="increment()"> + {{DELTA}} s</button>
`;
