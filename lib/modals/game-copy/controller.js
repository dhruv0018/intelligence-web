const angular = window.angular;

/**
 * Copy Game controller class
 * @class CopyGame
 */

CopyGameController.$inject = [
    '$scope',
    '$state',
    '$uibModalInstance',
    'Game',
    'AlertsService'
];

function CopyGameController (
    $scope,
    $state,
    $uibModalInstance,
    game,
    AlertsService
) {
    $scope.statusText = 'Copy now';

    /* TODO: get rid of this alert and use AlertService when it supports alerts specific to modals */
    $scope.alert  = null;
    $scope.teamId = null;

    $scope.copyGame = function() {
        $scope.statusText = 'Working...';
        $scope.alert      = null;
        if (game.isTeamUploadersTeam($scope.teamId)) {
            $scope.setAlert({
                type: 'danger',
                message: 'Game not copied. Uploaded by same team'
            });
            return;
        }
        if (!Number.isInteger($scope.teamId)) {
            $scope.setAlert({
                type: 'danger',
                message: 'Game not copied. Invalid team id'
            });
        }
        game.copy($scope.teamId).then( function onSuccess() {
            $scope.setAlert({
                type: 'success',
                message: 'Game has been copied to team id: ' + $scope.teamId
            });
            $scope.teamId  = null;
            $scope.form.$setPristine();
        }, function (error) {
            $scope.setAlert(AlertsService.alerts.pop());
        });
    };

    $scope.setAlert = function(alert){
        $scope.alert = alert;
        $scope.statusText = 'Copy now';
    };
}

export default CopyGameController;
