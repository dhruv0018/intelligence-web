/* Fetch angular from the browser scope */
var angular = window.angular;
var TeamAnalytics = angular.module('Coach.Analytics.Team');

TeamAnalytics.controller('TeamAnalyticsController', TeamAnalyticsController);

TeamAnalyticsController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'SessionService',
    'LeaguesFactory',
    'TeamsFactory',
    'GAME_TYPES',
    'StatsService'
];

/**
 * Team Analytics page controller
 */

function TeamAnalyticsController(
    $scope,
    $state,
    $stateParams,
    session,
    leagues,
    teams,
    GAME_TYPES,
    stats
) {

    var teamId = session.currentUser.currentRole.teamId;
    var team = teams.get(teamId);
    var league = leagues.get(team.leagueId);
    $scope.seasons = league.seasons;
    $scope.statsData = {};

    //Game type constants
    $scope.CONFERENCE = GAME_TYPES.CONFERENCE;
    $scope.NON_CONFERENCE = GAME_TYPES.NON_CONFERENCE;
    $scope.PLAYOFF = GAME_TYPES.PLAYOFF;

    $scope.filterQuery = {
        seasonId: league.seasons[0].id,
        gameType: ''
    };

    const generateStats = function () {
        $scope.loadingTables = true;

        function requestHandler(data) {
            $scope.statsData = stats.parse(data, 'Team');
            $scope.loadingTables = false;
        }

        const request = team.generateStats($scope.filterQuery);
        request.then(requestHandler);
    };

    $scope.generateStats = generateStats;

    generateStats();
}


require('./controller');
