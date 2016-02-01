WSCLinkController.$inject = [
    '$scope',
    '$filter',
    '$http',
    'SessionService',
    'PlayersFactory',
    'ROLES',
    'config'
];

function WSCLinkController (
    $scope,
    $filter,
    $http,
    session,
    players,
    ROLES,
    config
) {
    let userId = session.getCurrentUserId();
    let authorizeData = {};
    $scope.isCoach = session.currentUser.is(ROLES.COACH);
    $scope.isAthlete = session.currentUser.is(ROLES.ATHLETE);

    $scope.isAdmin = session.currentUser.has(ROLES.ADMIN) || session.currentUser.has(ROLES.SUPER_ADMIN);
    if(session.previousUser !== null) {
        $scope.isAdmin = $scope.isAdmin || session.previousUser.has(ROLES.ADMIN) || session.previousUser.has(ROLES.SUPER_ADMIN);
    }

    $scope.createWSCHighlight = function() {

        let wscUserId = $scope.isAdmin ? config.wsc.payBypassUserID : userId;

        let wscURL = `${config.wsc.redirectUrl}?userId=${wscUserId}`;
        authorizeData.userId = wscUserId;

        if ($scope.isCoach && !$scope.isScoutingGame) {
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
                playerDataString += player.id;
                if (player !== playersForHighlight[playersForHighlight.length-1]) {
                    wscURL = `${wscURL};`;
                    playerDataString += ';';
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

        let newWindow = window.open('about:blank', '_blank');
        newWindow.document.write('<html><head><title>Krossover Highlights</title></head><body><p>Loading...</p></body></html>');

        // POST to get requestId
        $http.post(config.wsc.authorizeUrl, authorizeData).success(function(responseData) {
            wscURL = `${wscURL}&requestId=${responseData}`;
            newWindow.location = wscURL;
        });
    };
}

export default WSCLinkController;
