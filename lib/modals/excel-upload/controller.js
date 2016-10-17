const angular = window.angular;

/**
 * Raw Film controller class
 * @class ExcelUpload
 */

ExcelUploadController.$inject = [
    '$http',
    '$scope',
    '$modalInstance',
    'config',
    'PlayersFactory',
    'TeamsFactory',
    'UsersFactory',
    'GamesFactory'
];

function ExcelUploadController (
    $http,
    $scope,
    $modalInstance,
    config,
    players,
    teams,
    users,
    games
) {
    $scope.errors = [];
    $scope.isUploading = false;

    $scope.uploadRoster = function() {
        var file = $scope.files[0];
        var data = new FormData();

        data.append('rosterId', $scope.rosterId);
        data.append('roster', file);
        $scope.isUploading = true;
        $scope.invalidFormat = false;

        $http.post(config.api.uri + 'players/file',

            data, {
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
            .then(uploadedPlayers => {
                var playersCollection = players.getCollection();
                var userIds = [];
                //update the cache
                uploadedPlayers.data.forEach(function(player) {
                    playersCollection[player.id] = player;
                    userIds.push(player.userId);
                });

                if ($scope.excelUploadConfig.type === 'team') {
                    teams.fetch($scope.team.id).then(function(team) {
                        angular.extend($scope.team, team);
                        $modalInstance.close();
                        $scope.isUploading = false;
                    });

                    //populates the collection with these user
                    users.load({
                        'id[]': userIds
                    });
                } else if ($scope.excelUploadConfig.type === 'game') {

                    $scope.game.allowEdits = false;

                    games.fetch($scope.game.id).then(function(game) {
                        angular.extend($scope.game, game);
                        $scope.game.allowEdits = true;

                        $modalInstance.close();
                        $scope.isUploading = false;
                    });
                }
            },
            function(failure) {
                $scope.invalidFormat = true;
                $scope.errors = [];
                $scope.isUploading = false;
                angular.forEach(failure.data.errors, function(error, row) {
                    angular.forEach(error, function(issue, field) {
                        $scope.errors.push({
                            row: row,
                            field: field,
                            issue: issue
                        });
                    });
                });
            });
    };

    $scope.clearAlerts = () => $scope.invalidFormat = false;

    $scope.retry = function() {
        $scope.invalidFormat = false;
        $scope.errors = [];
    };
}

export default ExcelUploadController;
