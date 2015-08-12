/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

IndexerGamesController.$inject = [
    '$scope',
    '$state',
    '$interval',
    'config',
    '$mdDialog',
    '$modal',
    'TeamsFactory',
    'LeaguesFactory',
    'GamesFactory',
    'SportsFactory',
    'UsersFactory',
    'SessionService',
    'GAME_STATUSES',
    'VIEWS',
];

function IndexerGamesController(
    $scope,
    $state,
    $interval,
    config,
    $mdDialog,
    $modal,
    teams,
    leagues,
    games,
    sports,
    users,
    session,
    GAME_STATUSES,
    VIEWS
) {

    const ONE_MINUTE = 60000;

    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.teams = teams.getCollection();
    $scope.users = users.getCollection();
    $scope.games = games.getList();
    $scope.currentUser = session.getCurrentUser();
    $scope.options = {scope: $scope};

    let now = moment.utc();
    angular.forEach($scope.games, function(game) {
        let team = teams.get(game.uploaderTeamId);
        game.timeRemaining = game.getRemainingTime(team, now);

    });

    $scope.getSportName = function(teamId) {
        const team = $scope.teams[teamId];

        if(team && team.leagueId){
            const gameLeagueId = team.leagueId;
            const gameSportId = $scope.leagues[gameLeagueId].sportId;
            return $scope.sports[gameSportId].name;
        }
    };

    $scope.getLatestAssignmentDate = function(game) {
        return game.userAssignment().timeAssigned;
    };

    $scope.getRemainingTime = function(game) {
        return game.getRemainingTime(teams.get(game.uploaderTeamId));
    };

    var refreshGames = function() {

        angular.forEach($scope.games, function(game) {

            if (game.timeRemaining) {

                game.timeRemaining = moment.duration(game.timeRemaining).subtract(1, 'minute').asMilliseconds();
            }
        });
    };

    var refreshGamesInterval = $interval(refreshGames, ONE_MINUTE);

    $scope.$on('$destroy', function() {

        $interval.cancel(refreshGamesInterval);
    });
}

export default IndexerGamesController;
