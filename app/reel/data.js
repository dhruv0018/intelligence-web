/* Fetch angular from the browser scope */
var angular = window.angular;

ReelDataDependencies.$inject = [
    'ReelsFactory',
    'GamesFactory',
    'TeamsFactory',
    'PlaysFactory',
    'PlayersFactory',
    'LeaguesFactory',
    'TagsetsFactory',
    'SessionService'
];

function ReelDataDependencies (
    reels,
    games,
    teams,
    plays,
    players,
    leagues,
    tagsets,
    session
) {

    class ReelData {

        constructor (reelId) {

            const userId = session.getCurrentUserId();

            /* Load data. */
            this.tagset = tagsets.load();
            this.leagues = leagues.load();
            this.reel = reels.load(reelId);
            this.games = games.load({reelId});
            this.teams = teams.load({reelId});
            this.plays = plays.load({reelId});
            this.playersByReelId = players.load({reelId});
            this.playersByUserId = players.load({userId});
        }
    }

    return ReelData;
}

export default ReelDataDependencies;
