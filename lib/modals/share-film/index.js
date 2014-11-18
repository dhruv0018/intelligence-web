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

        $scope.withOtherUsers = false;
        $scope.withPublic = false;
        $scope.withWufoo = false;
        $scope.linkActive = false;
        $scope.shareWithTeam = false;
        $scope.film = film;
        $scope.users = users.getCollection();
        $scope.currentUser = session.currentUser;
        $scope.ROLES = ROLES;
        $scope.filter = {'role[]': [ROLES.COACH.type.id, ROLES.ATHLETE.type.id]};

        //Check if film is a game or reel
        $scope.isGame = angular.isDefined($scope.film.gameType);

        if (film.isSharedWithPublic()) {
            $scope.linkActive = true;
        }

        if (!$scope.isGame) {
            if (film.isSharedWithTeam()) {
                $scope.shareWithTeam = true;
            }
        }

        //Share with user and submit
        $scope.shareSubmit = function(user) {
            film.shareWithUser(user);
            film.save();
        };

        //Stop sharing with user and submit
        $scope.shareRevoke = function(userId) {
            film.stopSharingWithUser(userId);
            film.save();
        };

        //Activate public share link
        $scope.activateLink = function() {
            film.shareWithPublic();
            film.save();
            $scope.linkActive = true;
        };

        //Deactivate public share link
        $scope.deactivateLink = function() {
            film.stopSharingWithPublic();
            film.save();
            $scope.linkActive = false;
        };

        //Share reel with your team toggle
        $scope.shareReelWithTeamToggle = function() {
            film.toggleTeamShare(session.currentUser.currentRole.teamId);
            film.save();
            $scope.shareWithTeam = !$scope.shareWithTeam;
        };

        $scope.shortId = Number($scope.film.id).toString(36);
    }
]);

