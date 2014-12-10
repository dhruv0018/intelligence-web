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
    'TeamsFactory', 'GAME_TYPES_IDS', 'GAME_TYPES', 'SessionService', 'ROLES', 'ShareFilm.Modal', 'BasicModals', 'AccountService',
    function directive(teams, GAME_TYPES_IDS, GAME_TYPES, session, ROLES, ShareFilmModal, modals, account) {

        var filmHeader = {

            restrict: TO += ELEMENTS,

            scope: {
                'play': '=?',
                'film': '=',
                'gameStates': '=?'
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

            $scope.filmTitle = 'Other';

            if ($scope.isClip) {
                $scope.filmTitle = 'Clip';
            } else if ($scope.isReel) {
                $scope.filmTitle = 'Reel';
            } else if ($scope.isGame) {
                var gameTypeId = GAME_TYPES_IDS[$scope.film.gameType];
                var gameType = GAME_TYPES[gameTypeId];
                $scope.filmTitle = gameType.name;
            }

            /* Data for share film modal */

            $scope.ShareFilmModal = ShareFilmModal;

            var currentUser = session.currentUser;
            $scope.isPublic = currentUser.is(ROLES.ANONYMOUS);
            $scope.isUploader = currentUser.id === $scope.film.uploaderUserId;

            /* Functionality for reels */

            $scope.deleteReel = function() {
                var deleteReelModal = modals.openForConfirm({
                    title: 'Delete Reel',
                    bodyText: 'Are you sure you want to delete this reel?',
                    buttonText: 'Yes'
                });

                deleteReelModal.result.then(function() {
                    $scope.film.remove();
                    account.gotoUsersHomeState();
                });
            };
        }

        return filmHeader;
    }
]);
