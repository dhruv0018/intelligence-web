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

            /* Load data. */

            this.playersByGame = players.load({gameId});

            this.games = games.load(gameId).then(() => {

                const data = {};
                const game = games.get(gameId);
                const teamId = session.getCurrentTeamId();

                data.playersByGameId = players.load({gameId});

                const gameTeamRoster = game.getRoster(game.teamId);
                const gameOpposingTeamRoster = game.getRoster(game.opposingTeamId);
                data.playersByRosters = players.load({
                        'rosterId[]': [
                            gameTeamRoster.id,
                            gameOpposingTeamRoster.id
                        ]
                    });

                data.arenaEvents = game.retrieveArenaEvents();
                data.customTags = customtags.load({teamId});

                return $q.all(data);
            });
        }
    }

    return ArenaChartData;
}

export default ArenaChartDataDependencies;
