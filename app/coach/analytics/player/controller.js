/* Fetch angular from the browser scope */
const angular = window.angular;

PlayerAnalyticsController.$inject = [
    '$scope',
    'SessionService',
    'TeamsFactory',
    'PlayersFactory',
    'LeaguesFactory',
    'GAME_TYPES',
    'StatsService'
];

/**
 * Player Analytics page controller
 */
function PlayerAnalyticsController(
    $scope,
    session,
    teams,
    players,
    leagues,
    GAME_TYPES,
    stats
) {

    const team = teams.get(session.getCurrentTeamId());
    const league = leagues.get(team.leagueId);
    const seasons = league.seasons;

    let player = null;

    const generateStats = function (selectedPlayer) {
        $scope.loadingTables = true;
        player = selectedPlayer || player;

        if (player) {

            const request = player.generateStats($scope.filterQuery);
            request.then(requestHandler);
        }
        else {

            $scope.loadingTables = false;
        }

        function requestHandler(data) {
            $scope.statsData = stats.parse(data, 'Player');
            $scope.loadingTables = false;
        }
    };

    players.load({rosterId: team.roster.id}).then(data => $scope.options = data);

    $scope.seasons = seasons;
    $scope.GAME_TYPES = GAME_TYPES;
    $scope.generateStats = generateStats;
    $scope.filterQuery = {
        seasonId: league.seasons[0].id,
        gameType: ''
    };
}

export default PlayerAnalyticsController;
