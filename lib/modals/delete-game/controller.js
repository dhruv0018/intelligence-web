const angular = window.angular;

/**
 * Delete Game controller class
 * @class DeleteGame
 */

DeleteGameController.$inject = [
    '$scope',
    '$state',
    '$uibModalInstance',
    'GamesFactory',
    'TeamsFactory',
    'Game',
    'FilmExchanges',
    'AlertsService',
    'SessionService',
    'AccountService',
    'ROLES',
    'SPORTS'
];

function DeleteGameController (
    $scope,
    $state,
    $uibModalInstance,
    games,
    teams,
    game,
    filmExchanges,
    alerts,
    session,
    account,
    ROLES,
    SPORTS
) {
    let currentUser = session.getCurrentUser();
    let teamId = game.teamId || currentUser.getCurrentRole().teamId;
    let sport = teams.get(teamId).getSport();
    if (currentUser.is(ROLES.COACH)) {
        $scope.sharedFilmExchanges = filmExchanges;
    }

    $scope.deleteGame = function() {
        game.isDeleted = true;

        games.save(game, function() {
            $uibModalInstance.close();
            if ($scope.adminManagementModal) {
                $scope.adminManagementModal.close();
            }

            if (currentUser.is(ROLES.ADMIN) || currentUser.is(ROLES.SUPER_ADMIN)) {
                $state.go('queue').then(successAlert);
            } else if (currentUser.is(ROLES.COACH)) {
                $state.go('FilmHomeGames').then(successAlert);
            }
        }, function() {
            alerts.add({
                type: 'danger',
                message: 'Your game has failed to delete. Please contact support.'
            });
            $uibModalInstance.close();

            if ($scope.adminManagementModal) {
                $scope.adminManagementModal.close();
            }

        });
    };

    function successAlert() {
        alerts.add({
            type: 'success',
            message: 'Your game has been successfully deleted'
        });
    }
}

export default DeleteGameController;
