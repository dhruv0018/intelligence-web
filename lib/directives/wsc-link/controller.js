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
    let wscURL = `http://krossover.clipro.tv/index.aspx?userId=${userId}`;
    const wscAuthorizeUrl = 'http://krossover.clipro.tv/api/requests';
    let authorizeData = {userId};
    $scope.isCoach = session.currentUser.is(ROLES.COACH);
    $scope.isAthlete = session.currentUser.is(ROLES.ATHLETE);

    $scope.createWSCHighlight = function() {

        if ($scope.isCoach) {
            let teamId = session.getCurrentTeamId();
            wscURL = `${wscURL}&teamId=${teamId}`;
            authorizeData.teamId = teamId;
        } else if ($scope.isAthlete) {
            let teamPlayers = [];
            $scope.teams.forEach(team => teamPlayers = teamPlayers.concat($filter('toArray')(team.roster.playerInfo)));
            let userPlayers = players.getList({userId});
            let playersForHighlight = [];

            userPlayers.forEach(userPlayer => {
                let userTeamPlayer = teamPlayers.find(teamPlayer => {
                    return Number(teamPlayer.id) === userPlayer.id;
                });
                if (userTeamPlayer) playersForHighlight.push(userTeamPlayer);
            });

            wscURL = `${wscURL}&playerId=`;
            let playerDataString = '';
            playersForHighlight.forEach(player => {
                wscURL = `${wscURL}${player.id}`;
                playerDataString = playerDataString + player.id;
                if (player !== playersForHighlight[playersForHighlight.length-1]) {
                    wscURL = `${wscURL};`;
                    playerDataString = playerDataString + ';';
                }
            });
            authorizeData.playerId = playerDataString;
        }

        if ($scope.reelId) {
            wscURL = `${wscURL}&reelId=${$scope.reelId}`;
            authorizeData.reelId = $scope.reelId;
        } else if ($scope.gameId) {
            wscURL = `${wscURL}&gameId=${$scope.gameId}`;
            authorizeData.gameId = $scope.gameId;
        } else if ($scope.seasonId) {
            wscURL = `${wscURL}&seasonId=${$scope.seasonId}`;
            authorizeData.seasonId = $scope.seasonId;
        }

        let newWindow = window.open('about:blank', 'newWindow');

        // POST to get requestId
        $http.post(wscAuthorizeUrl, authorizeData).success(function(responseData) {
            wscURL = `${wscURL}&requestId=${responseData}`;
            newWindow.location = wscURL;
        });
    };
}

export default WSCLinkController;
