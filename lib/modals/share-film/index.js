/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * ShareFilm page module.
 * @module ShareFilm
 */
var ShareFilm = angular.module('ShareFilm', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
ShareFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('share-film.html', template);
    }
]);

/**
 * ShareFilm modal dialog.
 * @module ShareFilm
 * @name ShareFilm.Modal
 * @type {value}
 */
ShareFilm.value('ShareFilm.ModalOptions', {

    templateUrl: 'share-film.html',
    controller: 'ShareFilm.controller',
    controllerAs: 'shareFilm'
});

/**
 * ShareFilm modal dialog.
 * @module ShareFilm
 * @name ShareFilm.Modal
 * @type {value}
 */
ShareFilm.service('ShareFilm.Modal', [
    '$modal', 'ShareFilm.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(film) {

                var resolves = {

                    resolve: {

                        Film: function() { return film; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * ShareFilm controller.
 * @module ShareFilm
 * @name ShareFilm.controller
 * @type {controller}
 */
ShareFilm.controller('ShareFilm.controller', [
    '$scope', '$state', '$modalInstance', '$timeout', 'SessionService', 'ShareFilm.Modal', 'BasicModals', 'Film', 'GamesFactory', 'ReelsFactory', 'UsersFactory', 'ROLES',
    function controller($scope, $state, $modalInstance, $timeout, session, modal, basicModal, film, games, reels, users, ROLES) {

        $scope.withTeam = false;
        $scope.withOtherUsers = false;
        $scope.withPublic = false;
        $scope.withWufoo = false;
        $scope.linkActive = false;
        $scope.sharedWithTeam = false;
        $scope.film = film;
        $scope.users = users.getCollection();
        $scope.currentUser = session.currentUser;
        $scope.ROLES = ROLES;
        $scope.filter = {'role[]': [ROLES.HEAD_COACH.type.id, ROLES.ASSISTANT_COACH.type.id, ROLES.ATHLETE.type.id]};

        //Check if film is a game or reel
        $scope.isGame = angular.isDefined($scope.film.gameType);

        if ($scope.film.isSharedWithPublic()) {
            $scope.linkActive = true;
        }

        if (!$scope.isGame) {
            if ($scope.film.isSharedWithTeam()) {
                $scope.shareWithTeam = true;
            }
        }

        //Share with user and submit
        $scope.shareSubmit = function(user) {
            $scope.film.shareWithUser(user);
            $scope.film.save();
        };

        //Stop sharing with user and submit
        $scope.shareRevoke = function(userId) {
            $scope.film.stopSharingWithUser(userId);
            $scope.film.save();
        };

        //Toggles public share link
        $scope.togglePublicLink = function() {
            $scope.film.togglePublicSharing();
            $scope.film.save();
            $scope.linkActive = !$scope.linkActive;
        };

        //Share reel with your team toggle
        $scope.shareReelWithTeamToggle = function() {
            $scope.film.toggleTeamShare(session.currentUser.currentRole.teamId);
            $scope.film.save();
            $scope.shareWithTeam = !$scope.shareWithTeam;
        };

        $scope.shortId = Number($scope.film.id).toString(36);
    }
]);

