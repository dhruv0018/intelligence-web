/* Fetch angular from the browser scope */
var angular = window.angular;

ArenaChartDataDependencies.$inject = [
    'PlaysFactory',
    'GamesFactory',
    'PlayersFactory',
    'CustomtagsFactory',
    '$q',
    '$timeout'
];

function ArenaChartDataDependencies (
    plays,
    games,
    players,
    customtags,
    $q,
    $timeout
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
                let deferred = $q.defer();
                data.customTags = deferred.promise;
                // data.customTags = customtags.load({teamId: game.uploaderTeamId});
                $timeout(()=>{
                    customtags.load({teamId: game.uploaderTeamId}).then(
                        (response)=>{
                            deferred.resolve();
                            return response;
                        }
                    );
                }, 1000);
                return $q.all(data);
            });
        }
    }

    return ArenaChartData;
}

export default ArenaChartDataDependencies;
