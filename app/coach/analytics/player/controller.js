/* Fetch angular from the browser scope */
var angular = window.angular;
var PlayerAnalytics = angular.module('Coach.Analytics.Player');

PlayerAnalytics.controller('PlayerAnalyticsController', PlayerAnalyticsController);

PlayerAnalyticsController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'SessionService',
    'LeaguesFactory',
    'TeamsFactory',
    'PlayersFactory',
    'GAME_TYPES'
];

/**
 * Player Analytics page controller
 */

function PlayerAnalyticsController(
    $scope,
    $state,
    $stateParams,
    session,
    leagues,
    teams,
    players,
    GAME_TYPES
) {
    var teamId = session.currentUser.currentRole.teamId;
    var team = teams.get(teamId);
    var league = leagues.get(team.leagueId);

    players.load({rosterId: team.roster.id}).then(function(data) {
        $scope.options = data;
    });

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
            $scope.statsData = statsData;
            $scope.loadingTables = false;
        });
    };
}

require('./controller');
