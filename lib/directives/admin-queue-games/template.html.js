import gameTemplate from './game-template.html';

export default `

<table class="queue-list">

    <thead>
        <tr>
            <th>
            <th>Sport</th>
            <th class="game-id">Game ID</th>
            <th>Game</th>
            <!-- FIXME: Move label column content into game column -->
            <th></th>
            <th>Coach</th>
            <th>Status</th>
            <th>Indexer</th>
            <th>QA</th>
            <th class="game-duration">Length</th>
            <th class="time-left">Time Left</th>
            <th></th>
        </tr>
    </thead>

    <tbody>

        <tr
            ng-repeat="game in queue
                | orderBy: ['-priority', 'deadline']
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
