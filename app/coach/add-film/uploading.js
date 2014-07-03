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
 * UploadingFilm controller.
 * @module UploadingFilm
 * @name UploadingFilmController
 * @type {Controller}
 */
UploadingFilm.controller('UploadingFilmController', [
    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'GamesFactory', 'PlayersFactory', 'Coach.Data',
    function controller(config, $rootScope, $scope, $state, $localStorage, $http, games, players, data) {

        $scope.games = games;

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

