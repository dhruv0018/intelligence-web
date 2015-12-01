WSCLinkController.$inject = [
    '$scope',
    '$filter',
    '$http',
    'SessionService',
    'PlayersFactory',
    'ROLES'
];

function WSCLinkController (
    $scope,
    $filter,
    $http,
    session,
    players,
    ROLES
) {
    let userId = session.getCurrentUserId();
    let wscURL = 'http://www.wsc.com/krossover-avgen?userId=' + userId;
    const wscAuthorizeUrl = 'http://krossover.clipro.tv/api/requests';
    let authorizeData = {userId};

    if (session.currentUser.is(ROLES.COACH)) {
        wscURL = wscURL + '&teamId=' + $scope.team.id;
        authorizeData.teamId = $scope.team.id;
    } else if (session.currentUser.is(ROLES.ATHLETE)) {
        let teamPlayers = $filter('toArray')($scope.team.roster.playerInfo);
        let userPlayers = players.getList({userId});
        let player;

        userPlayers.forEach(userPlayer => {
            player = teamPlayers.find(teamPlayer => {
                return Number(teamPlayer.id) === userPlayer.id;
            });
        });

        wscURL = wscURL + '&playerId=' + player.id;
        authorizeData.playerId = player.id;
    }

    if ($scope.reelId) {
        wscURL = wscURL + '&reelId=' + $scope.reelId;
        authorizeData.reelId = $scope.reelId;
    } else if ($scope.gameId) {
        wscURL = wscURL + '&gameId=' + $scope.gameId;
        authorizeData.gameId = $scope.gameId;
    } else if ($scope.seasonId) {
        wscURL = wscURL + '&seasonId=' + $scope.seasonId;
        authorizeData.seasonId = $scope.seasonId;
    }

    $scope.createWSCHighlight = function() {
        $http.post(wscAuthorizeUrl, authorizeData).then(wscAuthorizeSuccess, wscAuthorizeError);
    };

    function wscAuthorizeSuccess() {
        window.open(toString(wscURL), '_blank');
    }

    function wscAuthorizeError() {

    }
}

export default WSCLinkController;
