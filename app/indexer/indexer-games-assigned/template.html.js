export default `

<section class="indexer-games-assigned">

    <indexer-sidebar></indexer-sidebar>

    <div class="game-indexer-content">
        <div class="indexer-links-container">
            <a class="lookup" id="looking-for-game-cta" ng-href="{{signUpLocation}}" target="_blank">
                <div class="lookup-container">
                    <div class="right-container">
                        <i class="icon icon-chevron-right"></i>
                    </div>
                    <div class="left-container">
                        <i class="icon icon-bar-chart-o"></i>
                    </div>
                    <div class="middle-container">
                        <h3>Request to Index a Game</h3>
                    </div>
                </div>
            </a>
            <a ng-if="indexerQuality" class="lookup" id="games-available-cta" ui-sref="IndexerGamesAvailable">
                <div class="lookup-container">
                    <div class="right-container">
                        <i class="icon icon-chevron-right"></i>
                    </div>
                    <div class="left-container">
                        <i class="icon icon-bar-chart-o"></i>
                    </div>
                    <div class="middle-container">
                        <h3>See Games Available to QA</h3>
                    </div>
                </div>
            </a>
        </div>

        <h3>Your Game Queue</h3>
        <table class="table-striped table-hover indexer-list">
            <thead>
                <tr>
                    <th>Game ID</th>
                    <th>Game</th>
                    <th>Coach</th>
                    <th>Sport</th>
                    <th>Time Left</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="game in games
                    | gameIsDeleted: false
                    | gameIsNotSetAside
                    | gameHasCurrentUserAssignment
                    | gameCurrentUserAssignmentIsActive: true
                    | orderBy: 'timeRemaining':true"
                >
                    <td>{{game.id}}</td>
                    <td><a id="select-indexer-game-cta-game-{{$index}}" ui-sref="IndexerGame({ id: game.id })">{{teams[game.teamId].name}} vs {{teams[game.opposingTeamId].name}}</a></td>
                    <td>{{ getHeadCoachName(game) }}</td>
                    <td>{{ getSportName(game.teamId) | capitalizeFirstLetter }}</td>
                    <td>{{ game.timeRemaining | millisecondsAsDaysHoursMinutes }}</td>
                    <td>
                        <span ng-if="game.isAssignedToIndexer() && game.canBeIndexed() && game.isAssignedToUser(userId)">
                            <span ng-hide="game.isAssignmentStarted()">Ready to Index </span>
                            <span ng-show="game.isAssignmentStarted()">Indexing</span>
                        </span>
                        <span ng-if="game.canBeQAed() && game.isAssignedToQa() && game.isAssignedToUser(userId)">
                            <span ng-hide="game.isAssignmentStarted()">Ready to QA </span>
                            <span ng-show="game.isAssignmentStarted()">QAing</span>
                        </span>
                    <td>
                        <button id="enter-indexing-cta" class="btn btn-default" ng-show="game.isAssignedToIndexer() && game.canBeIndexed() && game.isAssignedToUser(userId)" ui-sref="indexing({ id: game.id })">
                            <span ng-hide="game.isAssignmentStarted()">Start Indexing</span>
                            <span ng-show="game.isAssignmentStarted()">Resume Indexing</span>
                        </button>
                        <button id="enter-qa-cta" class="btn btn-default" ng-show="game.canBeQAed() && game.isAssignedToQa() && game.isAssignedToUser(userId)" ui-sref="indexing({ id: game.id })">
                            <span ng-hide="game.isAssignmentStarted()">Start QA</span>
                            <span ng-show="game.isAssignmentStarted()">Resume QA</span>
                        </button>
                    </td>
                    </tr>
            </tbody>

        </table>
    </div>


</section>
`;
