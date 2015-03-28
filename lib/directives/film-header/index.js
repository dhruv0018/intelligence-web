/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film Header
 * @module Film Header
 */
var filmHeader = angular.module('film-header', []);

/* Cache the template file */
filmHeader.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('film-header.html', template);
    }
]);

/**
 * Film Header directive.
 * @module Film Header
 * @name Film Header
 * @type {Directive}
 */
filmHeader.directive('filmHeader', [
    'TeamsFactory', 'ReelsFactory', 'GAME_TYPES_IDS', 'GAME_TYPES', 'SessionService', 'AuthenticationService', 'ROLES', 'ShareFilm.Modal', 'BasicModals', 'AccountService', 'config',
    function directive(teams, reels, GAME_TYPES_IDS, GAME_TYPES, session, auth, ROLES, ShareFilmModal, modals, account, config) {

        var filmHeader = {

            restrict: TO += ELEMENTS,

            scope: {
                'play': '=?',
                'film': '=',
                'gameStates': '=?',
                'isEditable': '=?'
            },

            link: link,

            templateUrl: 'film-header.html',

        };

        function link($scope, element, attrs) {

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

        return filmHeader;
    }
]);
