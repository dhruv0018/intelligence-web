export default `

<section class="indexer-games-available">

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

        <div class="box-body">
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
                    <tr data-ng-repeat="game in games
                        | gameIsDeleted: false
                        | gameIsInQa: true
                        | orderBy: 'timeRemaining'
                        | limitTo: 100"
                    >
                        <td>{{game.id}}</td>
                        <td><a id="select-indexer-game-cta-game-{{$index}}" data-ui-sref="IndexerGame({ id: game.id })">{{teams[game.teamId].name}} vs {{teams[game.opposingTeamId].name}}</a></td>
                        <td>{{ getSportName(game.teamId) | capitalizeFirstLetter }}</td>
                        <td>{{ game.timeRemaining | millisecondsAsHours | hoursAsClock }}</td>
                        <td>
                            <button id="pick-up-qa-cta" class="btn btn-default index-button" ng-click="pickUpGame(game.id)">
                                <span>Pick Up to QA </span>
                            </button>
                        </td>
                        </tr>
                </tbody>

            </table>
        </div>
    </main>

</section>
`;
