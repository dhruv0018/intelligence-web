/* Fetch angular from the browser scope */
var angular = window.angular;

/**
* Film Header
* @module Film Header
*/
var filmHeader = angular.module('film-header');

/**
 * Film Header Controller.
 * @module Film Header
 * @name Film Header
 * @type {Controller}
 */
filmHeader.controller('filmHeader.Controller', [
    '$scope', 'config',
    'GAME_TYPES_IDS', 'GAME_TYPES', 'ROLES',
    'SessionService', 'AccountService',  'AuthenticationService',
    'ShareFilm.Modal', 'BasicModals',
    function controller(
        $scope, config,
        GAME_TYPES_IDS, GAME_TYPES, ROLES,
        session, account, auth,
        ShareFilmModal, modals
    ){
        /* State Booleans */

        if (angular.isDefined($scope.film)) $scope.isGame = $scope.film.description === 'games';
        if (angular.isDefined($scope.film)) $scope.isReel = $scope.film.description === 'reels';
        if (angular.isDefined($scope.play)) $scope.isClip = $scope.play.description === 'plays';

        /* Logic for film title */

        let setGameTitle = function() {
            if (!$scope.isReel && !$scope.isClip) {
                let gameTypeId = GAME_TYPES_IDS[$scope.film.gameType];
                let gameType = GAME_TYPES[gameTypeId];
                $scope.filmTitle = gameType.name;
            }
        };

        $scope.user = session.getCurrentUser();

        $scope.filmTitle = 'Other';

        if ($scope.isClip) {
            $scope.filmTitle = 'Clip';
        } else if ($scope.isReel) {
            $scope.filmTitle = 'Reel';
        } else if ($scope.isGame) {
            setGameTitle();
        }

        $scope.$watch('film.gameType', setGameTitle);

        /* Data for share film modal */

        $scope.ShareFilmModal = ShareFilmModal;

        $scope.isCoachOnUploaderTeam =
            $scope.user.is(ROLES.COACH) &&
            $scope.user.currentRole.teamId === $scope.film.uploaderTeamId;
        $scope.userIsLoggedIn = auth.isLoggedIn;
        $scope.isUploader = $scope.user.id === $scope.film.uploaderUserId;

        $scope.validVideo = $scope.isReel || $scope.film.isVideoTranscodeComplete();

        /* Functionality for reels */

        $scope.config = config;
        $scope.userCanPublishReel =
            ($scope.user.profile &&
            $scope.user.is(ROLES.ATHLETE) &&
            $scope.userIsLoggedIn &&
            $scope.isUploader);

        $scope.deleteReel = function() {

            let deleteReelModal = modals.openForConfirm({
                title: 'Delete Reel',
                bodyText: 'Are you sure you want to delete this reel?',
                buttonText: 'Yes'
            });

            deleteReelModal.result.then(function deleteModalCallback() {
                $scope.film.remove();
                account.gotoUsersHomeState();
            });
        };
    }
]);
