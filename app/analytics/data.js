/* Fetch angular from the browser scope */
const angular = window.angular;

AnalyticsDataDependencies.$inject = [
    '$q',
    'SessionService',
    'UsersFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'PlayersFactory',
    'ROLES',
    'ROLE_TYPE'
];

function AnalyticsDataDependencies (
    $q,
    session,
    users,
    teams,
    leagues,
    players,
    ROLES,
    ROLE_TYPE
) {

    class AnalyticsData {

        constructor () {
            /* Load data. */
            this.userId = session.getCurrentUserId();
            this.leagues = leagues.load();
            this.teamsAndPlayers = teamsAndPlayers(this);

            function teamsAndPlayers(outer) {
                let deferred = $q.defer();
                let currentUser = session.getCurrentUser();

                if(currentUser.is(ROLES.ATHLETE)) {
                    players.load({ userId: outer.userId }).then(deferred.resolve());
                }
                else {
                    users.load(outer.userId).then(function(){
                        let role = users.get(outer.userId).getCurrentRole();

                        teams.load({ relatedRoleId: role.id }).then(function(){
                            let team = teams.get(role.teamId);

                            players.load({ rosterId: team.roster.id }).then(function(){deferred.resolve();});
                        });
                    });
                }

                return deferred.promise;
            }

        }
    }

    return AnalyticsData;
}

export default AnalyticsDataDependencies;
