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

            open: function(game) {

                var resolves = {

                    resolve: {

                        Game: function() { return game; }
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
    '$scope', '$state', '$modalInstance', 'SessionService', 'ShareFilm.Modal', 'BasicModals', 'Game', 'GamesFactory', 'UsersFactory', 'ROLES',
    function controller($scope, $state, $modalInstance, session, modal, basicModal, game, games, users, ROLES) {

        $scope.withOtherUsers = false;
        $scope.withPublic = false;
        $scope.shareSuccess = false;
        $scope.game = game;
        $scope.users = users.getCollection();
        $scope.currentUser = session.currentUser;
        $scope.ROLES = ROLES;
        $scope.filter = {'role[]': ROLES.COACH.type.id};
        console.log($scope.filter);

        $scope.shareSubmit = function() {
            game.save();

            this.shareSuccess = true;
            this.withOtherUsers = false;
        };
    }
]);

