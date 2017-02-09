/* Fetch angular from the browser scope */
const angular = window.angular;

IndexerDataDependencies.$inject = [
    '$q',
    'SessionService',
    'UsersFactory',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'SportsFactory',
    'SchoolsFactory',
    'GAME_STATUSES'
];

function IndexerDataDependencies (
    $q,
    session,
    users,
    games,
    teams,
    leagues,
    sports,
    schools,
    GAME_STATUSES
) {

    class IndexerData {

        constructor () {
            this.userId = session.getCurrentUserId();

            // TODO: temporary fix to only load assigned games that are currently in indexing process
            let gamesFilter = {assignedUserId: this.userId};
            let usersFilter = {relatedUserId: this.userId};
            let acceptedGameStatusIds = [
                GAME_STATUSES.SUBMITTED_FOR_INDEXING.id,
                GAME_STATUSES.INDEXING.id,
                GAME_STATUSES.READY_FOR_QA.id,
                GAME_STATUSES.QAING.id,
                GAME_STATUSES.SET_ASIDE.id,
                GAME_STATUSES.INDEXED.id
            ];
            gamesFilter['status[]'] = acceptedGameStatusIds;
            usersFilter['status[]'] = acceptedGameStatusIds;
            /* Load data. */
            this.sports = sports.load();
            this.leagues = leagues.load();
            this.users = users.load(usersFilter);
            this.teams = teams.load({ relatedUserId: this.userId });
            this.games = games.load(gamesFilter);
            this.schools = this.teams.then(function(teams) {
                let schoolIds = teams

                .filter(function(team) {

                    return team.schoolId;
                })

                .map(function(team) {

                    return team.schoolId;
                });

                if (schoolIds.length) return schools.load(schoolIds);
            });

        }
    }

    return IndexerData;
}

export default IndexerDataDependencies;
