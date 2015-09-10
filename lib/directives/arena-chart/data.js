/* Fetch angular from the browser scope */
var angular = window.angular;

ArenaChartDataDependencies.$inject = [
    'PlaysFactory',
    'GamesFactory',
    'PlayersFactory',
    'CustomtagsFactory',
    '$q'
];

function ArenaChartDataDependencies (
    plays,
    games,
    players,
    customtags,
    $q
) {

    class ArenaChartData {

        constructor (gameId) {

            /* Load data. */

            this.playersByGame = players.load({gameId});

            this.plays = plays.load({gameId});

            this.games = games.load(gameId).then(() => {

                const data = {};
                const game = games.get(gameId);

                data.arenaEvents = game.retrieveArenaEvents();
                data.customTags = customtags.load({teamId: game.uploaderTeamId});

                return $q.all(data);
            });
        }
    }

    return ArenaChartData;
}

export default ArenaChartDataDependencies;
