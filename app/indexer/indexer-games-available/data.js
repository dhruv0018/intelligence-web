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
    'VIEWS'
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
    VIEWS
) {

    class IndexerData {

        constructor () {
            /* Load data. */
            this.userId = session.getCurrentUserId();
            this.sports = sports.load();
            this.leagues = leagues.load();
            this.users = users.load(VIEWS.QUEUE.USERS);
            this.teams = teams.load(VIEWS.QUEUE.TEAMS);
            this.games = [
                games.load(VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_1),
                games.load(VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_2),
                games.load(VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_3)
            ];
            /*TODO: schools should use /schools?relatedUserId*/

            this.schools = this.teams.then(function(teams) {
                let schoolIds = teams
                .filter(team => team.schoolId)
                .map(team => team.schoolId);

                if (schoolIds.length) return schools.load(schoolIds);
            });

        }
    }

    return IndexerData;
}

export default IndexerDataDependencies;
