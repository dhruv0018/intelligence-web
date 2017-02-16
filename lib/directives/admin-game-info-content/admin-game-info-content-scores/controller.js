AdminGameInfoContentScoresController.$inject = [
    '$scope',
    'TeamsFactory',
    'GAME_NOTE_TYPES'
];

function AdminGameInfoContentScoresController (
    $scope,
    teams,
    GAME_NOTE_TYPES
) {
    $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;
    $scope.team = $scope.game.teamId ? teams.get($scope.game.teamId) : null;
    $scope.opposingTeam = $scope.game.opposingTeamId ? teams.get($scope.game.opposingTeamId) : null;
}

export default AdminGameInfoContentScoresController;
