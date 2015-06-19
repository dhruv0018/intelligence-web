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
    $scope.loadingTables = true;
    $scope.statsData = {};

    //Game type constants
    $scope.CONFERENCE = GAME_TYPES.CONFERENCE;
    $scope.NON_CONFERENCE = GAME_TYPES.NON_CONFERENCE;
    $scope.PLAYOFF = GAME_TYPES.PLAYOFF;

    $scope.filterQuery = {
        seasonId: league.seasons[0].id,
        gameType: ''
    };

    team.generateStats($scope.filterQuery).then(function(statsData) {
        $scope.statsData = statsData;
        $scope.loadingTables = false;
    });

    $scope.generateStats = function() {
        $scope.loadingTables = true;
        team.generateStats($scope.filterQuery).then(function(statsData) {
            $scope.statsData = stats.parse(statsData, 'Team');
            $scope.loadingTables = false;
        });
    };
}


require('./controller');
