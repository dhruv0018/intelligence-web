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

                    let roles = currentUser.getRoles(ROLES.ATHLETE.type.id);
                    let playerPromises = [];
                    let teamPromises = [];

                    playerPromises.push(players.load({ userId: outer.userId }));

                    roles.forEach(function (role) {
                        if (role.teamId) {
                            // Gather the teams that this athlete is on
                            teamPromises.push(teams.load(role.teamId));
                        }
                    });

                    $q.all(teamPromises).then(function (teams) {
                        teams.forEach(function(teamsData) {
                            // Now gather the rosters for each team
                            playerPromises.push(players.load({ rosterId: teamsData[0].roster.id }));
                        });

                        $q.all(playerPromises).then(deferred.resolve());
                    });
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
