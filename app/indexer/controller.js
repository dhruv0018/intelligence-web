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
    'GAME_TYPES',
    'TeamsFactory',
    'LeaguesFactory',
    'GamesFactory',
    'SportsFactory',
    'UsersFactory',
    'SessionService',
    'Indexer.Games.Data',
    'INDEXER_GROUPS',
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
    GAME_TYPES,
    teams,
    leagues,
    games,
    sports,
    users,
    session,
    data,
    INDEXER_GROUPS,
    GAME_STATUSES,
    VIEWS
) {

    const ONE_MINUTE = 60000;
    const userLocation = session.getCurrentRole().indexerGroupId;

    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.sports = sports.getCollection();
    $scope.leagues = leagues.getCollection();
    $scope.teams = teams.getCollection();
    $scope.users = users.getCollection();
    $scope.userId = session.getCurrentUserId();
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
    $scope.gamesAvailable = games.getList();
    $scope.currentUser = session.getCurrentUser();

    const currentRole = session.getCurrentRole();
    $scope.indexerQuality = currentRole.indexerQuality;

    $scope.games.forEach(game => game.timeRemaining = game.assignmentTimeRemaining());

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

    $scope.getHeadCoachName = function(game) {
        // console.log('game', game);
        // let uploaderTeamId = game.uploaderTeamId;
        // if(teams[uploaderTeamId]) {
        //     let uploaderHeadCoachRole = teams[uploaderTeamId].getHeadCoachRole();
        //
        //     console.log('uploaderHeadCoachRole', uploaderHeadCoachRole);
        //     let uploaderHeadCoachUser = users[uploaderHeadCoachRole.userId];
        //     console.log('uploaderHeadCoachUser', uploaderHeadCoachUser);
        //     return uploaderHeadCoachUser.firstName + ' ' + uploaderHeadCoachUser.lastName;
        // }
        return;
    };

    let refreshGames = function() {

        $scope.games.forEach(game => {

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
