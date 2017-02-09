/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

IndexerGamesController.$inject = [
    'PRIORITIES',
    '$scope',
    '$interval',
    '$filter',
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
    $filter,
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
        case INDEXER_GROUPS.INDIA_SANDCUBE:
        case INDEXER_GROUPS.INDIA_SOURCEUS:
        case INDEXER_GROUPS.INDIA_RELATIVIT:
        case INDEXER_GROUPS.INDIA_TACKLESOFT:
        case INDEXER_GROUPS.INDIA_HIGHWAVE:
            $scope.signUpLocation = config.links.indexerSignUp.india.uri;
            break;
        case INDEXER_GROUPS.PHILIPPINES_MARKETPLACE:
            $scope.signUpLocation = config.links.indexerSignUp.philippines.uri;
            break;
    }

    $scope.games = games.getList();
    $scope.currentUser = session.getCurrentUser();

    /*Checks if the indexer has qa privileges*/
    const currentRole = session.getCurrentRole();
    $scope.indexerQuality = currentRole.indexerQuality;

    $scope.games = $filter('gameIsDeleted')($scope.games, false);
    $scope.games = $filter('gameIsIndexingOrQaing')($scope.games);
    $scope.games = $filter('gameHasCurrentUserAssignment')($scope.games);
    $scope.games = $filter('gameCurrentUserAssignmentIsActive')($scope.games, true);
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
