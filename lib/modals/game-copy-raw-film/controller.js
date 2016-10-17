const angular = window.angular;

/**
 * Copy Raw Film controller class
 * @class CopyRawFilm
 */

CopyRawFilmController.$inject = [
    '$scope',
    '$state',
    '$modalInstance',
    'AlertsService',
    'Parent'
];

function CopyRawFilmController (
    $scope,
    $state,
    $modalInstance,
    AlertsService,
    parent
) {
    let game = parent.scope.game;
    $scope.teams = parent.scope.allowedTeams;
    $scope.statusText = 'Copy';

    /* TODO: get rid of this alert and use AlertService when it supports alerts specific to modals */
    $scope.alert  = null;
    $scope.teamId = null;

    $scope.copyGame = function() {
        parent.scope.copyingRawFilm = true;
        $scope.statusText = 'Working...';
        $scope.alert = null;
        if (game.isTeamUploadersTeam($scope.teamId)) {
            $scope.setAlert({
                type: 'danger',
                message: 'Game not copied. Uploaded by same team.'
            });
            return;
        }
        if (!Number.isInteger($scope.teamId)) {
            $scope.setAlert({
                type: 'danger',
                message: 'Game not copied. Invalid team id.'
            });
        }
        game.copy($scope.teamId, true).then( function onSuccess() {
            $modalInstance.close();
        }, function onError(error) {
            parent.scope.copyingRawFilm = false;
            $scope.setAlert({
                type: 'danger',
                message: 'An error has occurred. Game not copied.'
            });
        });
    };

    $scope.setAlert = function(alert){
        $scope.alert = alert;
        $scope.statusText = 'Copy';
    };
}

export default CopyRawFilmController;
