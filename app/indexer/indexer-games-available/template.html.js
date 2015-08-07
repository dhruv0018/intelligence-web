export default `

<section class="indexer-games-available">

    <indexer-sidebar></indexer-sidebar>

    <div class="game-indexer-content">
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
                <tr data-ng-repeat="game in gamesAvailable
                    | gameIsDeleted: false
                    | gameIsReadyForQa
                    | gameNotIndexedByMe
                    | gameHasNotExpired: true
                    | orderBy: 'timeRemaining'
                    | limitTo: 100"
                >
                    <td>{{game.id}}</td>
                    <td><a id="select-indexer-game-cta-game-{{$index}}" data-ui-sref="IndexerGame({ id: game.id })">{{teams[game.teamId].name}} vs {{teams[game.opposingTeamId].name}}</a></td>
                    <td>{{ getSportName(game.teamId) | capitalizeFirstLetter }}</td>
                    <td>{{ game.timeRemaining | millisecondsAsDaysHoursMinutes }}</td>
                    <td>
                        <button id="pick-up-qa-cta" class="btn btn-default index-button" open-modal="QaPickup.Modal" modal-options="game.id">
                            Pick Up to QA
                        </button>
                    </td>
                    </tr>
            </tbody>

        </table>
    </div>

</section>
`;
