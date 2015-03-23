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
    '$timeout', 'TeamsFactory', 'ReelsFactory', 'GAME_TYPES_IDS', 'GAME_TYPES', 'SessionService', 'AuthenticationService', 'ROLES', 'ShareFilm.Modal', 'BasicModals', 'AccountService', 'config',
    function directive($timeout, teams, reels, GAME_TYPES_IDS, GAME_TYPES, session, auth, ROLES, ShareFilmModal, modals, account, config) {

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

            var setGameTitle = function() {
                if (!$scope.isReel && !$scope.isClip) {
                    var gameTypeId = GAME_TYPES_IDS[$scope.film.gameType];
                    var gameType = GAME_TYPES[gameTypeId];
                    $scope.filmTitle = gameType.name;
                }
            };

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

            $scope.isCoachOnUploaderTeam = session.currentUser.is(ROLES.COACH) &&
                                           session.currentUser.currentRole.teamId === $scope.film.uploaderTeamId;
            $scope.userIsLoggedIn = auth.isLoggedIn;
            $scope.isUploader = session.currentUser.id === $scope.film.uploaderUserId;

            $scope.validVideo = $scope.isReel || $scope.film.isVideoTranscodeComplete();

            /* Functionality for reels */
            $scope.config = config;
            $scope.publishing = false;

            $scope.toggleReelPublishing = function() {
                $scope.publishing = true;
                $scope.confirmPublish = false;

                if ($scope.film.isPublishedToProfile) {
                    $scope.film.unpublishFromProfile();
                    $scope.film.save();

                } else if (!$scope.film.isPublishedToProfile) {
                    //Ask user if they want to replace an already published reel
                    if (reels.getPublishedReels().length > 0) {
                        var publishReelConfirmModal = modals.openForConfirm({
                            title: 'Posting Reel',
                            bodyText: 'Do you want to replace the current reel on the profile page with this one?',
                            buttonText: 'Post Reel'
                        });

                        publishReelConfirmModal.result.then(function() {
                            $scope.savePublishedReel();
                        });
                    } else {
                        $scope.savePublishedReel();
                    }
                }

                $timeout(function() {
                    $scope.confirmPublish = true;
                }, 1000);
                $timeout(function() {
                    $scope.publishing = false;
                }, 2000);
            };

            $scope.savePublishedReel = function() {
                $scope.film.publishToProfile(reels.getByRelatedRole());
                $scope.film.save();
            };

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
