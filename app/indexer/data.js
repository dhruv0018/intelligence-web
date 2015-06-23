/* Fetch angular from the browser scope */
const angular = window.angular;

IndexingDataDependencies.$inject = [
    '$q',
    'SessionService',
    'UsersFactory',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'SportsFactory',
    'SchoolsFactory',
];

function IndexingDataDependencies (
    $q,
    session,
    users,
    games,
    teams,
    leagues,
    sports,
    schools
) {

    class IndexingData {

        constructor () {
            /* Load data. */
            this.userId = session.getCurrentUserId();
            this.sports = sports.load();
            this.leagues = leagues.load();
            this.users = users.load({ relatedUserId: this.userId });
            this.teams = teams.load({ relatedUserId: this.userId });
            this.games = games.load({ assignedUserId: this.userId });
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

    return IndexingData;
}

export default IndexingDataDependencies;
