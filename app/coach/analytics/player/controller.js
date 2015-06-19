/* Fetch angular from the browser scope */
const angular = window.angular;
const PlayerAnalytics = angular.module('Coach.Analytics.Player');

PlayerAnalytics.controller('PlayerAnalyticsController', PlayerAnalyticsController);

PlayerAnalyticsController.$inject = [
    '$scope',
    'SessionService',
    'TeamsFactory',
    'PlayersFactory'
];

/**
 * Player Analytics page controller
 */
function PlayerAnalyticsController(
    $scope,
    session,
    teams,
    players
) {

    const teamId = session.getCurrentTeamId();
    const team = teams.get(teamId);

    players.load({rosterId: team.roster.id}).then(function(data) {
        $scope.options = data;
    });
}

require('./controller');
