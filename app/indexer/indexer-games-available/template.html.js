export default `

<section class="indexer-games-available">

    <indexer-sidebar></indexer-sidebar>

    <div class="game-indexer-content">
        <div ng-show="filteredGames.length > 0">
            <h3>Available Games to be QA\'d</h3>
            <table class="queue-list">
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
                    <tr data-ng-repeat="game in games
                        | gameIsDeleted: false
                        | gameIsReadyForQa
                        | gameNotIndexedByCurrentUser
                        | orderBy: ['-priority', 'timeRemaining']
                        | limitTo: 100
                        as filteredGames"
                        ng-class="{
                            'queue-list__highest-priority': game.priority === PRIORITIES.HIGHEST.id,
                            'queue-list__high-priority': game.priority === PRIORITIES.HIGH.id,
                            'queue-list__normal-priority': game.priority === PRIORITIES.NORMAL.id,
                        }"
                    >
                        <td>{{game.id}}</td>
                        <!--TODO:Add as directive or factory method -->
                        <td>
                            <span>{{ teams[game.teamId].name }} vs {{ teams[game.opposingTeamId].name }}</span>
                            <krossover-team-label-icon
                                class="pull-right"
                                ng-if="teams[game.uploaderTeamId].label"
                                label="LABELS[LABELS_IDS[teams[game.uploaderTeamId].label]]"
                            ></krossover-team-label-icon>
                        </td>

                        <td>{{ getSportName(game.teamId) | capitalizeFirstLetter }}</td>
                        <!--TODO:Add as directive since it is used in the queue as well -->
                        <td class="time-left">
                            <span class="late" ng-if="game.timeRemaining < 0">{{ getRemainingTime(game) | millisecondsAsDaysHoursMinutes }}</span>
                            <span class="none" ng-if="game.timeRemaining === 0">None</span>
                            <span class="togo" ng-if="game.timeRemaining > 0">{{ getRemainingTime(game) | millisecondsAsDaysHoursMinutes }}</span>
                        </td>
                        <td>
                            <button id="pick-up-qa-cta" class="queue-button" ng-click="qaPickup(game)">
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
