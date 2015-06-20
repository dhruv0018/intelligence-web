/* Fetch angular from the browser scope */
const angular = window.angular;

PlayerAnalyticsController.$inject = [
    '$scope',
    'SessionService',
    'TeamsFactory',
    'PlayersFactory',
    'LeaguesFactory',
    'GAME_TYPES'
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
    GAME_TYPES
) {

    const team = teams.get(session.getCurrentTeamId());
    const league = leagues.get(team.leagueId);
    const seasons = league.seasons;

    $scope.player = null;

    const generateStats = function (selectedPlayer) {
        $scope.loadingTables = true;
        $scope.player = selectedPlayer || $scope.player;

        if ($scope.player) {

            const request = $scope.player.generateStats($scope.filterQuery);
            request.then(requestHandler);
        }
        else {

            $scope.loadingTables = false;
        }

        function requestHandler(data) {
            $scope.stats = data;
            $scope.loadingTables = false;
        }
    };

    $scope.options = players.getList({rosterId: team.roster.id});

    $scope.stats = {};
    $scope.seasons = seasons;
    $scope.GAME_TYPES = GAME_TYPES;
    $scope.generateStats = generateStats;
    $scope.filterQuery = {
        seasonId: league.seasons[0].id,
        gameType: ''
    };
}

export default PlayerAnalyticsController;
