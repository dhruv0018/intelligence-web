/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

IndexerGamesController.$inject = [
    'EVENT',
    'GamesResolutionEventEmitter',
    'IndexerGamesService',
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
    'LABELS',
    'LABELS_IDS',
    'QaPickup.Modal'
];

function IndexerGamesController(
    EVENT,
    GamesResolutionEventEmitter,
    IndexerGames,
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
    LABELS,
    LABELS_IDS,
    QaPickupModal
) {
    const ONE_MINUTE = 60000;

    $scope.LABELS = LABELS;
    $scope.LABELS_IDS = LABELS_IDS;
    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.teams = teams.getCollection();
    $scope.users = users.getCollection();

    $scope.games = games.getList(VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_3)
        .concat(games.getList(VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_2))
        .concat(games.getList(VIEWS.QUEUE.GAME.READY_FOR_QA_PRIORITY_1));

    $scope.currentUser = session.getCurrentUser();
    $scope.options = {scope: $scope};

    let now = moment.utc();

    GamesResolutionEventEmitter.on(EVENT.ADMIN.QUERY.COMPLETE, (event, games) =>  {

        if (games.length === 0) {
            $scope.emptyOutQueue();
        } else {
            $scope.games = games;
        }
    });

    $scope.emptyOutQueue = () => {

        $scope.games = [];
    };

    $scope.getSportName = function(teamId) {

        const team = teams.get(teamId);
        return team.getSport().name;
    };

    $scope.getLatestAssignmentDate = function(game) {
        return game.userAssignment().timeAssigned;
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
}

export default IndexerGamesController;
