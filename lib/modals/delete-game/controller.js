const angular = window.angular;

/**
 * Delete Game controller class
 * @class DeleteGame
 */

DeleteGameController.$inject = [
    '$scope',
    '$state',
    '$modalInstance',
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
    $modalInstance,
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
    let sport = teams.get(game.teamId).getSport();
    if (currentUser.is(ROLES.COACH)) {
        $scope.sharedFilmExchanges = filmExchanges;
    }

    $scope.deleteGame = function() {
        game.isDeleted = true;

        games.save(game, function() {
            $modalInstance.close();
            if ($scope.adminManagementModal) {
                $scope.adminManagementModal.close();
            }

            if (currentUser.is(ROLES.ADMIN) || currentUser.is(ROLES.SUPER_ADMIN)) {
                $state.go('queue').then(successAlert);
            } else if (currentUser.is(ROLES.COACH)) {
                if (sport.id === SPORTS.FOOTBALL.id || sport.id === SPORTS.VOLLEYBALL.id) {
                    $state.go('Coach.FilmHome').then(successAlert);
                } else {
                    $state.go('FilmHomeGames').then(successAlert);
                }
            }
        }, function() {
            alerts.add({
                type: 'danger',
                message: 'Your game has failed to delete. Please contact support.'
            });
            $modalInstance.close();

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