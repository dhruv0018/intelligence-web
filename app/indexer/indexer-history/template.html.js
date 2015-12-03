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
                            'queue-list__highest-priority': games[assignment.gameId].priority === PRIORITIES.HIGHEST.id,
                            'queue-list__high-priority': games[assignment.gameId].priority === PRIORITIES.HIGH.id,
                            'queue-list__normal-priority': games[assignment.gameId].priority === PRIORITIES.NORMAL.id,
                        }"
                    >
                        <td>{{assignment.timeAssigned | date:'MM/dd/yyyy'}}</td>
                        <td>{{assignment.gameId}}</td>
                        <!-- TODO Add a getter in GamesFactory that returns the team vs opposing team string -->
                        <td>
                            <a id="select-indexer-game-cta-game-{{$index}}" data-ui-sref="IndexerGame({ id: assignment.gameId })">
                            {{teams[games[assignment.gameId].teamId].name}} vs {{teams[games[assignment.gameId].opposingTeamId].name}}
                            </a>
                        </td>
                        <td>{{ getSportName(games[assignment.gameId].teamId) | capitalizeFirstLetter }}</td>
                        <td>{{assignment.isQa ? 'QA' : 'Indexed'}}</td>
                        <td>
                            {{assignment.timeFinished ? (assignment.timeFinished | date:'MM/dd/yyyy') : 'Incomplete'}}
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
