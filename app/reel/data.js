/* Fetch angular from the browser scope */
var angular = window.angular;

ReelDataDependencies.$inject = [
    'ReelsFactory',
    'GamesFactory',
    'TeamsFactory',
    'PlaysFactory',
    'SelfEditedPlaysFactory',
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
    selfEditedPlays,
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
            this.games = games.load({reelId});
            this.teams = teams.load({reelId});
            this.plays = plays.load({reelId});
            this.selfEditedPlays = selfEditedPlays.load({reelId});
            this.playersByReelId = players.load({reelId});
            this.playersByUserId = players.load({userId});

            /* load reels by relatedUserId for logged in users,
            else when user refresh's the related reels is lost */
            if (userId) {
                this.reels = reels.load({ relatedUserId: userId });
            } else {
                this.reel = reels.load(reelId);
            }
        }
    }

    return ReelData;
}

export default ReelDataDependencies;
