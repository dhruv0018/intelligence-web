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
    'SessionService',
    'UsersFactory',
    '$q'
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
    session,
    users,
    $q
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

            /* Load players and users from roster or they won't be populated
            in share reel modal on reload */
            this.rosterPlayers = this.teams.then(teams => players.loadPlayersFromTeam(teams[0]));
            this.users = users.load({ relatedUserId: userId });

            /* load reels by relatedUserId for logged in users,
            else when user refresh's the related reels is lost */

            if (userId) {
                this.reels = reels.load({ relatedUserId: userId });
            } else {
                let deferred = $q.defer();
                this.reelCreatedByUser = deferred.promise;
                this.reel = reels.load(reelId).then((reels) => {
                    let reel = reels[0];
                    users.load(reel.uploaderUserId).then(() => { deferred.resolve(); });
                    return reel;
                });
            }
        }
    }

    return ReelData;
}

export default ReelDataDependencies;
