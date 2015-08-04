/* Fetch angular from the browser scope */
var angular = window.angular;

ArenaChartDataDependencies.$inject = [
    'GamesFactory',
    'SessionService',
    'PlayersFactory',
    'CustomtagsFactory',
    '$q'
];

function ArenaChartDataDependencies (
    games,
    session,
    players,
    customtags,
    $q
) {

    class ArenaChartData {

        constructor (gameId) {

            const teamId = session.getCurrentTeamId();

            /* Load data. */

            this.playersByGame = players.load({gameId});
            this.customTags = customtags.load({teamId});

            this.games = games.load(gameId).then(() => {

                const data = {};
                const game = games.get(gameId);

                const gameTeamRoster = game.getRoster(game.teamId);
                const gameOpposingTeamRoster = game.getRoster(game.opposingTeamId);

                // TODO: Use filter once implemented: players?gameId
                data.playersByRosters = players.load({
                        'rosterId[]': [
                            gameTeamRoster.id,
                            gameOpposingTeamRoster.id
                        ]
                    });

                data.arenaEvents = game.retrieveArenaEvents();

                return $q.all(data);
            });
        }
    }

    return ArenaChartData;
}

export default ArenaChartDataDependencies;
