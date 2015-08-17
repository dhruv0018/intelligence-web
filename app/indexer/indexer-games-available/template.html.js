export default `

<section class="indexer-games-available">

    <indexer-sidebar class="sidebar"></indexer-sidebar>

    <div class="game-indexer-content">
        <div ng-show="filteredGames.length > 0">
            <h3>Available Games to be QA\'d</h3>
            <table class="table-striped table-hover indexer-list">
                <thead>
                    <tr>
                        <th>Game ID</th>
                        <th>Game</th>
                        <th>Sport</th>
                        <th>Time Left</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr data-ng-repeat="game in filteredGames = (games
                        | gameIsDeleted: false
                        | gameIsReadyForQa
                        | gameNotIndexedByMe
                        | orderBy: 'timeRemaining'
                        | limitTo: 100)"
                    >
                        <td>{{game.id}}</td>
                        <td>{{ teams[game.teamId].name }} vs {{ teams[game.opposingTeamId].name }}</td>
                        <td>{{ getSportName(game.teamId) | capitalizeFirstLetter }}</td>
                        <td class="time-left">
                            <span class="late" ng-if="game.timeRemaining < 0">{{ getRemainingTime(game) | millisecondsAsDaysHoursMinutes }}</span>
                            <span class="none" ng-if="game.timeRemaining === 0">None</span>
                            <span class="togo" ng-if="game.timeRemaining > 0">{{ getRemainingTime(game) | millisecondsAsDaysHoursMinutes }}</span>
                        </td>
                        <td>
                            <button id="pick-up-qa-cta" class="btn btn-default index-button" open-modal="QaPickup.Modal" modal-options="game.id">
                                Pick Up to QA
                            </button>
                        </td>
                        </tr>
                </tbody>
            </table>
        </div>
        <div ng-hide="filteredGames.length > 0">
            <h3>There aren't any games available for you currently. Please check back later.</h3>
        </div>
    </div>

</section>
`;
