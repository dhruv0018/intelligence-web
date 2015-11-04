export default `

    <section class="indexer-history">

        <indexer-sidebar></indexer-sidebar>

        <div class="game-indexer-content">
            <div ng-show="filteredGames.length > 0">
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
                    <tr data-ng-repeat="game in games
                        | gameIsDeleted: false
                        | gameIsNotSetAside
                        | gameHasCurrentUserAssignment
                        | gameCurrentUserAssignmentIsActive: false
                        | orderBy: getLatestAssignmentDate: true
                        as filteredGames"
                    >
                        <td>{{game.userAssignment().timeAssigned | date:'MM/dd/yyyy'}}</td>
                        <td>{{game.id}}</td>
                        <!-- TODO Add a getter in GamesFactory that returns the team vs opposing team string -->
                        <td><a id="select-indexer-game-cta-game-{{$index}}" data-ui-sref="IndexerGame({ id: game.id })">{{teams[game.teamId].name}} vs {{teams[game.opposingTeamId].name}}</a></td>
                        <td>{{ getSportName(game.teamId) | capitalizeFirstLetter }}</td>
                        <td>{{game.userAssignment().isQa ? 'QA' : 'Indexed'}}</td>
                        <td>
                            {{game.userAssignment().timeFinished ? (game.userAssignment().timeFinished | date:'MM/dd/yyyy') : 'Incomplete'}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div ng-hide="filteredGames.length > 0">
                <h3>You haven't worked on any games yet.</h3>
            </div>
        </div>

    </section>
`;
