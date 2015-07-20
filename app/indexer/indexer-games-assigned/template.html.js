export default `

<section class="indexer-games-assigned">

    <aside class="sidebar">

        <x-krossover-role user="currentUser" role="currentUser.currentRole"></x-krossover-role>

        <hr>

        <h4>Football FAQ</h4>
        <ul>
            <li><a id="football-faq-cta" href="{{footballFAQ}}" target="_blank">Passing zones, run gaps, and formations</a></li>
        </ul>

        <h4>Volleyball FAQ</h4>
        <ul>
            <li><a id="volleyball-faq-cta" href="{{volleyballFAQ}}" target="_blank">Positions for determining rotation</a></li>
        </ul>

    </aside>

    <main class="content" data-ui-view="content">

        <div class="flex-container">
            <a class="lookup" id="looking-for-game-cta" href="{{signUpLocation}}" target="_blank">
                <div class="lookup-container flex-item">
                    <div class="right-container">
                        <i class="icon icon-chevron-right"></i>
                    </div>
                    <div class="left-container">
                        <i class="icon icon-bar-chart-o"></i>
                    </div>
                    <div class="middle-container">
                        <h3>Request to Index a Game</h3>
                        <p>Click here to sign up to index or QA a game.</p>
                    </div>
                </div>
            </a>
            <a ng-if="indexerQuality" class="lookup container" id="games-available-cta" ui-sref="IndexerGamesAvailable">
                <div class="lookup-container flex-item">
                    <div>
                        <h3>See Games Available to QA</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="box-body">
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
                    <tr data-ng-repeat="game in games
                        | gameIsDeleted: false
                        | gameIsNotSetAside
                        | gameHasCurrentUserAssignment
                        | gameCurrentUserAssignmentIsActive: true
                        | orderBy: 'timeRemaining':true"
                    >
                        <td>{{game.id}}</td>
                        <td><a id="select-indexer-game-cta-game-{{$index}}" data-ui-sref="IndexerGame({ id: game.id })">{{teams[game.teamId].name}} vs {{teams[game.opposingTeamId].name}}</a></td>
                        <td>{{users[teams[game.uploaderTeamId].getHeadCoachRole().userId].firstName}} {{users[teams[game.uploaderTeamId].getHeadCoachRole().userId].lastName}}</td>
                        <td>{{ getSportName(game.teamId) | capitalizeFirstLetter }}</td>
                        <td>{{ game.timeRemaining | millisecondsAsHours | hoursAsClock }}</td>
                        <td>{{game.userAssignment().isQa ? 'QA' : 'Indexed'}}</td>
                        <td>
                            <button id="enter-indexing-cta" class="btn btn-default" data-ng-show="game.isAssignedToIndexer() && game.canBeIndexed() && game.isAssignedToUser(userId)" data-ui-sref="indexing({ id: game.id })">
                                <span data-ng-hide="game.isAssignmentStarted()">Start </span>
                                <span data-ng-show="game.isAssignmentStarted()">Resume </span>
                                <span data-ng-show="game.isAssignedToIndexer()">Indexing</span>
                            </button>
                            <button id="enter-qa-cta" class="btn btn-default" data-ng-show="game.canBeQAed() && game.isAssignedToQa() && game.isAssignedToUser(userId)" data-ui-sref="indexing({ id: game.id })">
                                <span data-ng-hide="game.isAssignmentStarted()">Start </span>
                                <span data-ng-show="game.isAssignmentStarted()">Resume </span>
                                <span>QA</span>
                            </button>
                        </td>
                        </tr>
                </tbody>

            </table>
        </div>
    </main>

</section>
`;
