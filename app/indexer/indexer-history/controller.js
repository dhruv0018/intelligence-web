IndexerGamesHistoryController.$inject = [
    '$scope',
    'GamesFactory',
    'TeamsFactory',
    'SportsFactory',
    'SessionService',
    'GAME_STATUSES'
];

function IndexerGamesHistoryController(
    $scope,
    games,
    teams,
    sports,
    session,
    GAME_STATUSES
) {
    $scope.assignments = [];
    $scope.teams = teams.getMap();
    $scope.games = games.getMap();
    $scope.sports = sports.getCollection();

    let userId = session.getCurrentUserId();

    games.getList({ assignedUserId: userId })
        .filter(game => game.isDeleted === false)
        .filter(game => game.status !== GAME_STATUSES.SET_ASIDE.id)
        .forEach(game => {
            let assignments = game.getInactiveAssignmentsByUserId(userId);
            $scope.assignments = $scope.assignments.concat(assignments);
        });

    $scope.getSportName = function(teamId) {

        const team = $scope.teams[teamId];

        if(team && team.leagueId){

            return team.getSport().name;
        }
    };
}

export default IndexerGamesHistoryController;
