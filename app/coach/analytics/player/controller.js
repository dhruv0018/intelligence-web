/* Fetch angular from the browser scope */
const angular = window.angular;
const PlayerAnalytics = angular.module('Coach.Analytics.Player');

PlayerAnalytics.controller('PlayerAnalyticsController', PlayerAnalyticsController);

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

    const onPlayerSelect = function (player) {

        const playerId = player.id;
    };

    const generateStats = function () {
        $scope.loadingTables = true;

        function requestHandler(data) {
            $scope.statsData = stats.parse(data, 'Player');
            $scope.loadingTables = false;
        }

        const request = team.generateStats($scope.filterQuery);
        request.then(requestHandler);
    };

    players.load({rosterId: team.roster.id}).then(data => $scope.options = data);

    $scope.onPlayerSelect = onPlayerSelect;
    $scope.selectedOption = {};
    $scope.GAME_TYPES = GAME_TYPES;
    $scope.generateStats = generateStats;
    $scope.filterQuery = {
        seasonId: league.seasons[0].id,
        gameType: ''
    };

    generateStats();
}

require('./controller');
