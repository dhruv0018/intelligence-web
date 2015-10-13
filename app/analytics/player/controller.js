/* Fetch angular from the browser scope */
const angular = window.angular;

PlayerAnalyticsController.$inject = [
    '$scope',
    'SessionService',
    'TeamsFactory',
    'PlayersFactory',
    'LeaguesFactory',
    'GAME_TYPES',
    'ROLES'
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
    ROLES
) {

    const team = teams.get(session.getCurrentTeamId());
    const league = leagues.get(team.leagueId);
    const seasons = league.seasons;
    let currentUser = session.getCurrentUser();

    $scope.currentUserIsAthlete = currentUser.is(ROLES.ATHLETE);

    const generateStats = function (selectedPlayer) {
        $scope.loadingTables = true;
        $scope.player = selectedPlayer || $scope.player;

        // If a player has been selected
        if ($scope.player) {

            $scope.filterQuery.id = $scope.player.id;

            const request = $scope.player.generateStats($scope.filterQuery);
            request.then(requestHandler);
        }
        else {

            $scope.loadingTables = false;
        }

        function requestHandler(data) {
            // Populate dynamic-tables
            $scope.stats = data;
            $scope.loadingTables = false;
        }
    };

    // Players to populate search-dropdown
    $scope.players = players.getList({rosterId: team.roster.id});
    // Reference to selected player
    $scope.player = null;
    // Reference to generateStats data response, to populate dynamic-tables
    $scope.stats = {};
    // Available seasons for filters
    $scope.seasons = seasons;
    // Available game types for filters
    $scope.GAME_TYPES = GAME_TYPES;
    // Publish request method as callback on scope
    $scope.generateStats = generateStats;
    // Query parameters for /players/:playerId/analytics
    $scope.filterQuery = {
        seasonId: league.seasons[0].id,
        gameType: ''
    };

    // Set filter criteria to jersey number, first initial, last name
    $scope.players.forEach(player => {
        if (team.roster.playerInfo[player.id].jerseyNumber) {
            let jerseyNumber = team.roster.playerInfo[player.id].jerseyNumber;
            player.extendedName = '#' + jerseyNumber + ' ' + player.shortName;
        } else {
            player.extendedName = player.shortName;
        }
    });

    // If current user is an athlete, generate their stats
    if ($scope.currentUserIsAthlete) {
        let athletePlayers = $scope.players.filter(player => player.userId === currentUser.id);

        if ($scope.players.length) {
            $scope.player = athletePlayers[0];
            generateStats($scope.player);
        }
    }

    // Sort players by jersey number
    $scope.players.sort((a, b) => {
        return Number(team.roster.playerInfo[a.id].jerseyNumber) - Number(team.roster.playerInfo[b.id].jerseyNumber);
    });
}

export default PlayerAnalyticsController;
