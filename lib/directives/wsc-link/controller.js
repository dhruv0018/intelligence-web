WSCLinkController.$inject = [
    '$scope',
    '$filter',
    'SessionService',
    'PlayersFactory',
    'ROLES'
];

function WSCLinkController (
    $scope,
    $filter,
    session,
    players,
    ROLES
) {
    let userId = session.getCurrentUserId();
    $scope.wscURL = 'http://www.wsc.com/krossover-avgen?userId=' + userId;

    if (session.currentUser.is(ROLES.COACH)) {
        $scope.wscURL = $scope.wscURL + '&teamId=' + $scope.team.id;
    } else if (session.currentUser.is(ROLES.ATHLETE)) {
        let teamPlayers = $filter('toArray')($scope.team.roster.playerInfo);
        let userPlayers = players.getList({userId});
        userPlayers.forEach(userPlayer => {
            let player = teamPlayers.find(teamPlayer => {
                return Number(teamPlayer.id) === userPlayer.id;
            });
        });

        $scope.wscURL = $scope.wscURL + '&playerId=' + player.id;
    }

    if ($scope.reelId) {
        $scope.wscURL = $scope.wscURL + '&reelId=' + $scope.reelId;
    } else if ($scope.gameId) {
        $scope.wscURL = $scope.wscURL + '&gameId=' + $scope.gameId;
    } else if ($scope.seasonId) {
        $scope.wscURL = $scope.wscURL + '&seasonId=' + $scope.seasonId;
    }

    console.log($scope.wscURL);
}

export default WSCLinkController;
