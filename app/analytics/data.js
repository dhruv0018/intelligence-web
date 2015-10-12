/* Fetch angular from the browser scope */
const angular = window.angular;

AnalyticsDataDependencies.$inject = [
    '$q',
    'SessionService',
    'UsersFactory',
    'TeamsFactory',
    'LeaguesFactory'
];

function AnalyticsDataDependencies (
    $q,
    session,
    users,
    teams,
    leagues
) {

    class AnalyticsData {

        constructor () {
            /* Load data. */
            this.userId = session.getCurrentUserId();
            this.leagues = leagues.load();
            this.users = users.load({ relatedUserId: this.userId });
            this.teams = teams.load({ relatedUserId: this.userId });

            this.teams.then(function(relatedTeams) {

                let rosters = [];
                let teamIds = session.currentUser.getTeamIds();

                relatedTeams

                .filter(function(team) {

                    return ~teamIds.indexOf(team.id);
                })

                .forEach(function(team) {

                    rosters.push(players.load({ rosterId: team.roster.id }));
                });

                this.players = $q.all(rosters);
            });
        }
    }

    return AnalyticsData;
}

export default AnalyticsDataDependencies;
