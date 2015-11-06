import gameTemplate from './game-template.html';

export default `

<table class="queue-list">

    <tbody>

        <tr
            ng-repeat="game in queue
                | orderBy: ['-priority', 'remainingTime']
                track by $index"
            ng-class="{
                'queue-list__highest-priority': game.priority === PRIORITIES.HIGHEST.id,
                'queue-list__high-priority': game.priority === PRIORITIES.HIGH.id,
                'queue-list__normal-priority': game.priority === PRIORITIES.NORMAL.id
            }"
        >${gameTemplate}</tr>

    </tbody>

</table>
`;
