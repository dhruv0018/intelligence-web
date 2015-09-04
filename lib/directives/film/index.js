/*globals require*/
/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template Constants */
const templateUrl = 'film.html';
const template    = require('./template.html');

/**
 * Film
 * @module Film
 */
let Film = angular.module('film', [
    'ui.router',
    'ui.bootstrap',
    'thumbnail'
]);

/* Cache the template file */
Film.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Film directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Film.directive('krossoverFilm', krossoverFilm);

krossoverFilm.$inject = [
    'ROLES',
    'TeamsFactory',
    'UsersFactory',
    'GamesFactory',
    'ReelsFactory',
    'SessionService',
    'ShareFilm.Modal',
    'GAME_TYPES_IDS',
    'GAME_TYPES'
];

function krossoverFilm (
    ROLES,
    teams,
    users,
    games,
    reels,
    session,
    ShareFilmModal,
    GAME_TYPES_IDS,
    GAME_TYPES
) {

    const film = {

        restrict: TO += ELEMENTS,

        templateUrl: templateUrl,

        scope: {
            film: '='
        },

        replace: true,

        link: link
    };

    function link ($scope, element, attrs) {

        let currentUser = session.currentUser;
        $scope.currentUser = currentUser;
        $scope.COACH = ROLES.COACH;
        $scope.ATHLETE = ROLES.ATHLETE;

        //Check if film is a game or reel
        $scope.isGame = angular.isDefined($scope.film.gameType);

        // Create an element ID for film share CTA
        $scope.filmShareElemId = ['film-share', $scope.isGame ? 'game' : 'reel', $scope.film.id, 'cta'].join('-');

        $scope.isUploader = $scope.film.uploaderUserId === currentUser.id;

        //Check if film is shared with user
        $scope.isShared =
            $scope.film.isSharedWithUser(currentUser) ||
            (!$scope.isGame && !$scope.isUploader && $scope.film.isSharedWithTeamId(currentUser.currentRole.teamId));

        $scope.isCoachOnUploaderTeam =
            currentUser.is(ROLES.COACH) &&
            currentUser.currentRole.teamId === $scope.film.uploaderTeamId;

        $scope.hideFilm = false;

        if (currentUser.is(ROLES.ATHLETE) && $scope.isGame && !$scope.film.isVideoTranscodeComplete()) {
            $scope.hideFilm = true;
        } else if ($scope.isShared && $scope.isGame && !$scope.film.isVideoTranscodeComplete()) {
            $scope.hideFilm = true;
        }

        $scope.ShareFilmModal = ShareFilmModal;

        let uploaderUser = {};
        $scope.uploaderName = '';

        if ($scope.isShared) {
            if ($scope.film.isSharedWithUser(currentUser)) {
                uploaderUser = users.get($scope.film.getShareByUser(currentUser).userId);
            } else if ($scope.film.isSharedWithTeamId(currentUser.currentRole.teamId)) {
                uploaderUser = users.get($scope.film.getShareByTeamId(currentUser.currentRole.teamId).userId);
            }
        } else {
            uploaderUser = users.get($scope.film.uploaderUserId);
        }

        if (uploaderUser.id === currentUser.id) {
            $scope.uploaderName = 'you';
        } else {
            $scope.uploaderName = uploaderUser.firstName + ' ' + uploaderUser.lastName;
        }

        if ($scope.isGame) {
            $scope.isReady = false;
            if ($scope.film.isDelivered() || $scope.film.isShared()) {
                $scope.isReady = true;
            }
        }

        switch ($scope.film.description) {
            case 'games':
                let gameTypeId = GAME_TYPES_IDS[$scope.film.gameType];
                let gameType = GAME_TYPES[gameTypeId];
                $scope.filmTitle = gameType.name;
                break;
            case 'reels':
                $scope.filmTitle = 'Reel';
                break;
            default:
                $scope.filmTitle = 'Other';
        }
    }

    return film;
}
