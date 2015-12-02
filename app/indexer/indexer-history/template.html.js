export default `

    <section class="indexer-history">

        <indexer-sidebar></indexer-sidebar>

        <div class="game-indexer-content">
            <div ng-show="assignments.length > 0">
                <h3>Games History</h3>

                <table class="queue-list">
                    <thead>
                    <tr>
                        <th>Date Assigned</th>
                        <th>Game ID</th>
                        <th>Game</th>
                        <th>Sport</th>
                        <th>Status</th>
                        <th>Date Completed</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr data-ng-repeat="assignment in assignments | orderBy: '-timeAssigned' "
                        ng-class="{
                            'queue-list__highest-priority': assignment.game.priority === PRIORITIES.HIGHEST.id,
                            'queue-list__high-priority': assignment.game.priority === PRIORITIES.HIGH.id,
                            'queue-list__normal-priority': assignment.game.priority === PRIORITIES.NORMAL.id,
                        }"
                    >
                        <td>{{assignment.game.userAssignment().timeAssigned | date:'MM/dd/yyyy'}}</td>
                        <td>{{assignment.game.id}}</td>
                        <!-- TODO Add a getter in GamesFactory that returns the team vs opposing team string -->
                        <td>
                            <a id="select-indexer-game-cta-game-{{$index}}" data-ui-sref="IndexerGame({ id: assignment.game.id })">
                            {{teams[assignment.game.teamId].name}} vs {{teams[assignment.game.opposingTeamId].name}}
                            </a>
                        </td>
                        <td>{{ getSportName(assignment.game.teamId) | capitalizeFirstLetter }}</td>
                        <td>{{assignment.game.userAssignment().isQa ? 'QA' : 'Indexed'}}</td>
                        <td>
                            {{assignment.game.userAssignment().timeFinished ? (assignment.game.userAssignment().timeFinished | date:'MM/dd/yyyy') : 'Incomplete'}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div ng-hide="assignments.length > 0">
                <h3>You haven't worked on any games yet.</h3>
            </div>
        </div>

    </section>
`;
