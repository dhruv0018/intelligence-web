/* Component dependencies. */
/* Component settings */
var templateUrl = 'coach/add-film/uploading.html';

/* Component resources */
var template = require('./uploading.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Uploading film page module.
 * @module UploadingFilm
 */
var UploadingFilm = angular.module('uploading-film', [
    'ui.router',
    'ui.bootstrap',
    'plan',
    'Coach.Game'
]);

/* Cache the template file */
UploadingFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Uploading film page state router.
 * @module UploadingFilm
 * @type {UI-Router}
 */
UploadingFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var uploadingFilm = {
            name: 'uploading-film',
            parent: 'add-film',
            url: '',
            views: {
                'content@add-film': {
                    templateUrl: 'coach/add-film/uploading.html',
                    controller: 'UploadingFilmController'
                }
            }
        };

        $stateProvider.state(uploadingFilm);
    }
]);

/**
 * Uploading tabs value service.
 * @module UploadingFilm
 * @name UploadingFilmTabs
 * @type {Controller}
 */
UploadingFilm.value('UploadingFilmTabs', {

    'game-info':     { active: true, disabled: false },
    'your-team':     { active: false, disabled: true },
    'opposing-team': { active: false, disabled: true },
    instructions:    { active: false, disabled: true }
});

/**
 * UploadingFilm controller.
 * @module UploadingFilm
 * @name UploadingFilmController
 * @type {Controller}
 */
UploadingFilm.controller('UploadingFilmController', [
    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'GamesFactory', 'PlayersFactory', 'UploadingFilmTabs', 'Coach.Data',
    function controller(config, $rootScope, $scope, $state, $localStorage, $http, games, players, tabs, data) {

        $scope.games = games;

        $scope.tabs = tabs;

//        tabs['game-info']     = { active: true, disabled: false };
//        tabs['your-team']     = { active: false, disabled: true };
//        tabs['opposing-team'] = { active: false, disabled: true };
//        tabs.instructions     = { active: false, disabled: true };

        var deleteVideo = function() {

            var game = $scope.game;

            if (game && game.video && game.video.guid) {

                /* Send DELETE request to KVS. */
                $http.delete(config.kvs.uri + 'upload/' + game.video.guid)

                .error(function() {

                    throw new Error('Problem deleting canceled video from KVS');
                });
            }
        };

        $scope.cancel = function() {

            $scope.$flow.cancel();

            deleteVideo();

            $state.go('add-film');
        };

        $scope.$on('flow::error', function(event, $flow, $message) {

            $scope.$flow.cancel();

            deleteVideo();

            $scope.error = true;

            $scope.$apply();
        });

        $scope.$on('flow::complete', function() {

            if (!$scope.error) $scope.complete = true;

            $scope.$apply();
        });

        $scope.headings = {
            opposingTeam: 'Opposing Team',
            yourTeam: 'Team',
            scoutingTeam: 'Scouting'
        };
    }
]);

