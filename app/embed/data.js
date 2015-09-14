/* Fetch angular from the browser scope */
var angular = window.angular;

EmbedDataDependencies.$inject = [
    'ReelsFactory',
    'GamesFactory',
    'TeamsFactory',
    'PlaysFactory',
    'PlayersFactory',
    'LeaguesFactory',
    'TagsetsFactory'
];

function EmbedDataDependencies (
    reels,
    games,
    teams,
    plays,
    players,
    leagues,
    tagsets
) {

    class EmbedData {

        constructor (reelId) {

            /* Load data. */
            this.tagset = tagsets.load();
            this.leagues = leagues.load();
            this.reel = reels.load(reelId);
            this.games = games.load({reelId: reelId});
            this.teams = teams.load({reelId: reelId});
            this.plays = plays.load({reelId: reelId});
            this.players = players.load({reelId: reelId});
        }
    }

    return EmbedData;
}

export default EmbedDataDependencies;
