AdminGameInfoTeamSidebarController.$inject = [
    '$scope',
    'TeamsFactory',
    'UsersFactory',
    'LeaguesFactory',
    'SchoolsFactory',
    'TURNAROUND_TIME_MIN_TIME_LOOKUP'
];

function AdminGameInfoTeamSidebarController (
    $scope,
    teams,
    users,
    leagues,
    schools,
    minTurnaroundTimeLookup
) {
    $scope.minTurnaroundTimeLookup = minTurnaroundTimeLookup;
    $scope.uploaderTeam = teams.get($scope.game.uploaderTeamId);
    $scope.uploaderUser = users.get($scope.game.uploaderUserId);
    $scope.league = leagues.get($scope.uploaderTeam.leagueId);
    $scope.activePlan = $scope.uploaderTeam.getActivePlan();
    $scope.school = ($scope.uploaderTeam.schoolId) ? schools.get($scope.uploaderTeam.schoolId) : null;

    let headCoachRole = $scope.uploaderTeam.getHeadCoachRole();
    if (headCoachRole) {
        $scope.headCoach = users.get(headCoachRole.userId);
    }
}

export default AdminGameInfoTeamSidebarController;
