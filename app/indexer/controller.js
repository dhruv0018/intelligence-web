/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

IndexerGamesController.$inject = [
    '$scope',
    '$interval',
    'config',
    'TeamsFactory',
    'LeaguesFactory',
    'GamesFactory',
    'SportsFactory',
    'UsersFactory',
    'SessionService',
    'INDEXER_GROUPS',
    'GAME_STATUSES'
];

function IndexerGamesController(
    $scope,
    $interval,
    config,
    teams,
    leagues,
    games,
    sports,
    users,
    session,
    INDEXER_GROUPS,
    GAME_STATUSES
) {

    const ONE_MINUTE = 60000;
    const userLocation = session.getCurrentRole().indexerGroupId;

    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.userId = session.getCurrentUserId();

    let relatedUserfilter = { relatedUserId: $scope.userId };

    $scope.teams = teams.getMap(relatedUserfilter);
    $scope.users = users.getMap(relatedUserfilter);
    $scope.footballFAQ = config.links.indexerFAQ.football.uri;
    $scope.volleyballFAQ = config.links.indexerFAQ.volleyball.uri;
    $scope.options = {scope: $scope};

    switch (userLocation) {
        case INDEXER_GROUPS.US_MARKETPLACE:
            $scope.signUpLocation = config.links.indexerSignUp.unitedStates.uri;
            break;
        case INDEXER_GROUPS.INDIA_MARKETPLACE:
        case INDEXER_GROUPS.INDIA_OFFICE:
            $scope.signUpLocation = config.links.indexerSignUp.india.uri;
            break;
        case INDEXER_GROUPS.PHILIPPINES_OFFICE:
            $scope.signUpLocation = config.links.indexerSignUp.philippines.uri;
            break;
    }

    $scope.games = games.getList({ assignedUserId: $scope.userId });
    $scope.currentUser = session.getCurrentUser();

    /*Checks if the indexer has qa privileges*/
    const currentRole = session.getCurrentRole();
    $scope.indexerQuality = currentRole.indexerQuality;

    $scope.games.forEach(game => game.timeRemaining = game.assignmentTimeRemaining());

    $scope.getSportName = function(teamId) {

        const team = $scope.teams[teamId];

        if(team && team.leagueId){

            return team.getSport().name;
        }
    };

    $scope.getLatestAssignmentDate = (game) => game.userAssignment().timeAssigned;

    let refreshGames = function() {

        $scope.gamesAvailable.forEach(function(game) {
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
