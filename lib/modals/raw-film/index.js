/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * RawFilm page module.
 * @module RawFilm
 */
var RawFilm = angular.module('RawFilm', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
RawFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('raw-film.html', template);
    }
]);

/**
 * RawFilm modal dialog.
 * @module RawFilm
 * @name RawFilm.Modal
 * @type {value}
 */
RawFilm.value('RawFilm.ModalOptions', {

    templateUrl: 'raw-film.html',
    controller: 'RawFilm.controller',
    size: 'lg'
});

/**
 * RawFilm modal dialog.
 * @module RawFilm
 * @name RawFilm.Modal
 * @type {value}
 */
RawFilm.service('RawFilm.Modal', [
    '$modal', 'RawFilm.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(game, removeGameFromFilmExchange, copyGameFromFilmExchange, trackEmailClick) {

                var resolves = {

                    resolve: {

                        Game: function() { return game; },
                        RemoveGameFromFilmExchange: function() { return removeGameFromFilmExchange; },
                        CopyGameFromFilmExchange: function() { return copyGameFromFilmExchange; },
                        TrackEmailClick: function() { return trackEmailClick; }
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
 * RawFilm controller.
 * @module RawFilm
 * @name RawFilm.controller
 * @type {controller}
 */
RawFilm.controller('RawFilm.controller', [
    '$scope',
    '$state',
    '$modalInstance',
    'RawFilm.Modal',
    'Game',
    'RemoveGameFromFilmExchange',
    'CopyGameFromFilmExchange',
    'TrackEmailClick',
    'PlayManager',
    'SessionService',
    'ROLES',
    function controller(
        $scope,
        $state,
        $modalInstance,
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
            $modalInstance.close();
            removeGameFromFilmExchange(game);
        };

        $scope.copyGameFromFilmExchange = function() {
            copyGameFromFilmExchange(game);
        };

        $scope.onEmailClick = function() {
            trackEmailClick($scope.game);
        };
    }
]);
