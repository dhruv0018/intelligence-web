export default `

    <section class="indexer-history">

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

        <a class="lookup" id="looking-for-game-cta" href="{{signUpLocation}}" target="_blank">
            <div class="lookup-container">
                <div class="right-container">
                    <i class="icon icon-chevron-right"></i>
                </div>
                <div class="left-container">
                    <i class="icon icon-bar-chart-o"></i>
                </div>
                <div class="middle-container">
                    <h3>Looking for a game?</h3>
                    <p>Click here to sign up to index or QA a game.</p>
                </div>
            </div>
        </a>

        <div class="box-body">
            <h3>Your Game Queue</h3>
            <table class="table table-bordered">
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
                    | orderBy: game.userAssignment().timeAssigned"
                >
                    <td>{{game.userAssignment().timeAssigned | date:'MM/dd/yyyy'}}</td>
                    <td>{{game.id}}</td>
                    <!-- TODO Add a getter in GamesFactory that returns the team vs opposing team string -->
                    <td><a id="select-indexer-game-cta-game-{{$index}}" data-ui-sref="IndexerGame({ id: game.id })">{{teams[game.teamId].name}} vs {{teams[game.opposingTeamId].name}}</a></td>
                    <td>{{getSportName(game.teamId)}}</td>
                    <td>{{game.userAssignment().isQa ? 'QA' : 'Indexed'}}</td>
                    <td>
                        {{game.userAssignment().timeFinished ? (game.userAssignment().timeFinished | date:'MM/dd/yyyy') : 'Incomplete'}}
                    </td>
                </tr>
                </tbody>

        </table>
        </div>
        </main>

    </section>
`;
