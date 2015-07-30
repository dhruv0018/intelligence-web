/* Fetch angular from the browser scope */
var angular = window.angular;

ArenaChartDataDependencies.$inject = [
    'GamesFactory',
    'SessionService',
    'PlayersFactory',
    'CustomtagsFactory'
];

function ArenaChartDataDependencies (
    games,
    session,
    players,
    customtags
) {

    class ArenaChartData {

        constructor (gameId) {

            /* Load data. */
            this.game = games.load(gameId).then(() => {

                const game = games.get(gameId);
                const teamId = session.getCurrentTeamId();

                this.playersByGameId = players.load({gameId});

                const gameTeamRoster = game.getRoster(game.teamId);
                const gameOpposingTeamRoster = game.getRoster(game.opposingTeamId);
                this.playersByRosters = players.load({
                        'rosterId[]': [
                            gameTeamRoster.id,
                            gameOpposingTeamRoster.id
                        ]
                    });

                this.arenaEvents = game.retrieveArenaEvents();
                this.customTags = customtags.load({teamId});
            });

            this.playersByGame = players.load({gameId});
        }
    }

    return ArenaChartData;
}

export default ArenaChartDataDependencies;
