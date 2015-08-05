/* Fetch angular from the browser scope */
var angular = window.angular;

ArenaChartDataDependencies.$inject = [
    'GamesFactory',
    'PlayersFactory',
    'CustomtagsFactory',
    '$q'
];

function ArenaChartDataDependencies (
    games,
    players,
    customtags,
    $q
) {

    class ArenaChartData {

        constructor (gameId) {

            /* Load data. */

            this.playersByGame = players.load({gameId});

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
                data.customTags = customtags.load({teamId: game.uploaderTeamId});

                return $q.all(data);
            });
        }
    }

    return ArenaChartData;
}

export default ArenaChartDataDependencies;
