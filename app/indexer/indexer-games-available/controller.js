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
    'QaPickup.Modal'
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
    VIEWS,
    QaPickupModal
) {
    const ONE_MINUTE = 60000;

    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.teams = teams.getCollection();
    $scope.users = users.getCollection();
    $scope.games = games.getList(VIEWS.QUEUE.GAME);
    $scope.currentUser = session.getCurrentUser();
    $scope.options = {scope: $scope};

    let now = moment.utc();

    $scope.games.forEach(function(game) {
        let team = teams.get(game.uploaderTeamId);
        game.timeRemaining = game.getRemainingTime(team, now);
    });

    $scope.getSportName = function(teamId) {

        const team = teams.get(teamId);
        return team.getSport().name;
    };

    $scope.getLatestAssignmentDate = function(game) {
        return game.userAssignment().timeAssigned;
    };

    $scope.getRemainingTime = function(game) {
        return game.getRemainingTime(teams.get(game.uploaderTeamId));
    };

    $scope.qaPickup = function(game) {
        let modal = QaPickupModal.open({
            resolve: {
                game: function() { return game; }
            }
        });

        modal.result.then( (newGames) => {
            /*Load new games from the server since list is outdated*/
            $scope.games = newGames;
        });
    };


    /*TODO: Make this into a directive as this code appears many times*/
    let refreshGames = function() {

        $scope.games.forEach(function(game) {

            if (game.timeRemaining) {

                game.timeRemaining = moment.duration(game.timeRemaining).subtract(1, 'minute').asMilliseconds();
            }
        });

    };

    let refreshGamesInterval = $interval(refreshGames, ONE_MINUTE);

    $scope.$on('$destroy', function() {

        $interval.cancel(refreshGamesInterval);
    });
}

export default IndexerGamesController;
