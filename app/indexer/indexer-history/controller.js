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
    console.log('hi');
    $scope.assignments = [];
    $scope.teams = teams.getMap();
    $scope.games = games.getMap();
    $scope.sports = sports.getCollection();

    let userId = session.getCurrentUserId();

    //let timeAssigned = (firstGame, secondGame) =>  secondGame.timeAssigned - firstGame.timeAssigned;

    games.getList({ assignedUserId: userId })
        .filter(game => game.isDeleted === false)
        .filter(game => game.status !== GAME_STATUSES.SET_ASIDE.id)
        //.sort(timeAssigned)
        .forEach(game => {
            let assignments = game.getInactiveAssignmentsByUserId(userId);
            assignments.forEach(assignment => {
            assignment.game = game;
            console.log(assignment.timeAssigned);
            $scope.assignments.push(assignment);
        });
    });

    $scope.getSportName = function(teamId) {

        const team = $scope.teams[teamId];

        if(team && team.leagueId){

            return team.getSport().name;
        }
    };
}

export default IndexerGamesHistoryController;
