/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

PlayerAnalyticsController.$inject = [
    '$scope',
    '$filter',
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
    $filter,
    session,
    teams,
    players,
    leagues,
    GAME_TYPES,
    ROLES
) {

    const team = teams.get(session.getCurrentTeamId());
    const league = leagues.get(team.leagueId);
    const seasons = league.seasons.sort((a, b) => moment(b.startDate).diff(a.startDate));

    let currentUser = session.getCurrentUser();

    $scope.currentUserIsAthlete = currentUser.is(ROLES.ATHLETE);
    $scope.team = team;
    $scope.sport = team.getSport();

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

    if (!$scope.currentUserIsAthlete) {
        // Set filter criteria to jersey number, first initial, last name
        $scope.players.forEach(player => {
            if (team.roster.playerInfo[player.id].jerseyNumber) {
                let jerseyNumber = team.roster.playerInfo[player.id].jerseyNumber;
                player.extendedName = '#' + jerseyNumber + ' ' + player.shortName;
            } else {
                player.extendedName = player.shortName;
            }
        });

        // Sort players by jersey number
        $scope.players.sort((a, b) => {
            return Number(team.roster.playerInfo[a.id].jerseyNumber) - Number(team.roster.playerInfo[b.id].jerseyNumber);
        });
    }

    // If current user is an athlete, generate their stats
    if ($scope.currentUserIsAthlete) {
        let activeRoles = currentUser.getActiveRoles();
        let athleteRoles = activeRoles.filter(role => currentUser.is(role, ROLES.ATHLETE));

        // Get teams this athlete plays for
        $scope.teams = athleteRoles.map(role => teams.get(role.teamId));

        generateStatsForAthlete();
    }

    $scope.changeTeam = function changeTeam(newTeam) {
        // Get list of players for new team
        $scope.sport = newTeam.getSport();
        $scope.players = players.getList({rosterId: newTeam.roster.id});
        generateStatsForAthlete();
    };

    function generateStatsForAthlete() {
        // Get players for this user, expected to be an array with one player object
        let athletePlayers = $scope.players.filter(player => player.userId === currentUser.id);

        if (athletePlayers.length) {
            $scope.player = athletePlayers[0];
            generateStats($scope.player);
        }
    }
}

export default PlayerAnalyticsController;
