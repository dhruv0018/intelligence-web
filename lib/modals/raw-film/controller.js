const angular = window.angular;

/**
 * Raw Film controller class
 * @class RawFilm
 */

RawFilmController.$inject = [
    '$scope',
    '$state',
    '$uibModalInstance',
    'RawFilm.Modal',
    'Game',
    'RemoveGameFromFilmExchange',
    'CopyGameFromFilmExchange',
    'TrackEmailClick',
    'PlayManager',
    'SessionService',
    'ROLES'
];

function RawFilmController (
    $scope,
    $state,
    $uibModalInstance,
    modal,
    game,
    removeGameFromFilmExchange,
    copyGameFromFilmExchange,
    trackEmailClick,
    playManager,
    session,
    ROLES
) {
    $scope.game = game;
    $scope.video = game.video;
    $scope.currentUser = session.getCurrentUser();
    $scope.ROLES = ROLES;
    playManager.videoTitle = 'rawFilm';

    if (game.idFilmExchangeFilm) {
        $scope.isFilmExchangeVideo = true;
    } else {
        $scope.isFilmExchangeVideo = false;
    }

    $scope.removeGameFromFilmExchange = function() {
        $uibModalInstance.close();
        removeGameFromFilmExchange(game);
    };

    $scope.copyGameFromFilmExchange = function() {
        copyGameFromFilmExchange(game);
    };

    $scope.onEmailClick = function() {
        trackEmailClick($scope.game);
    };
}

export default RawFilmController;
