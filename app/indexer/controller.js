/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

IndexerGamesController.$inject = [
    'PRIORITIES',
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
    'LABELS',
    'LABELS_IDS',
    'GAME_STATUSES'
];

function IndexerGamesController(
    PRIORITIES,
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
    LABELS,
    LABELS_IDS,
    GAME_STATUSES
) {

    const ONE_MINUTE = 60000;
    const userLocation = session.getCurrentRole().indexerGroupId;

    $scope.LABELS = LABELS;
    $scope.LABELS_IDS = LABELS_IDS;
    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.userId = session.getCurrentUserId();
    $scope.teams = teams.getMap();
    $scope.users = users.getMap();
    $scope.footballFAQ = config.links.indexerFAQ.football.uri;
    $scope.volleyballFAQ = config.links.indexerFAQ.volleyball.uri;
    $scope.options = {scope: $scope};
    $scope.PRIORITIES = PRIORITIES;

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

    $scope.games.forEach(game => game.assignmentTimeRemaining = game.assignmentTimeRemaining());

    $scope.getSportName = function(teamId) {

        const team = $scope.teams[teamId];

        if(team && team.leagueId){

            return team.getSport().name;
        }
    };

    $scope.getLatestAssignmentDate = (game) => game.userAssignment().timeAssigned;
}

export default IndexerGamesController;
