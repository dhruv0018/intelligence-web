/* Fetch angular from the browser scope */
var angular = window.angular;

EmbedDataDependencies.$inject = [
    'ReelsFactory',
    'GamesFactory',
    'TeamsFactory',
    'PlaysFactory',
    'LeaguesFactory'
];

function EmbedDataDependencies (
    reels,
    games,
    teams,
    plays,
    leagues
) {

    class EmbedData {

        constructor (reelId) {

            /* Load data. */
            this.leagues = leagues.load();
            this.reel = reels.load(reelId);
            this.games = games.load({reelId: reelId});
            this.teams = teams.load({reelId: reelId});
            this.plays = plays.load({reelId: reelId});
        }
    }

    return EmbedData;
}

export default EmbedDataDependencies;
