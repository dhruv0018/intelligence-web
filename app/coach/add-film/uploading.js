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
 * UploadingFilm controller.
 * @module UploadingFilm
 * @name UploadingFilmController
 * @type {Controller}
 */
UploadingFilm.controller('UploadingFilmController', [
    'config', '$rootScope', '$scope', '$state', '$http', 'GamesFactory', 'PlayersFactory', 'GAME_STATUSES', 'Coach.Data', '$window',
    function controller(config, $rootScope, $scope, $state, $http, games, players, GAME_STATUSES, data, $window) {

        $scope.isDefined = angular.isDefined;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.games = games;
        $window.krossover = $window.krossover || {};
        $window.krossover.videoUploadStatus = 'STARTED';

        $window.onbeforeunload = function() {

            if ($scope.$flow.isUploading() ||
                $window.krossover &&
                ($window.krossover.videoUploadStatus === 'STARTED' && $window.krossover.videoUploadStatus !== 'COMPLETE')) {

                return 'Video still uploading! Are you sure you want to close the page and cancel the upload?';
            }
        };

        var deleteVideo = function() {

            var game = $scope.game;

            if (game && game.video && game.video.guid) {

                var url = config.api.uri + 'upload-server';

                /* Request the upload URL for KVS. */
                $http.get(url)

                .success(function(response) {

                    /* Get KVS url from the response. */
                    var kvsUrl = response.url;

                    /* Send DELETE request to KVS. */
                    $http.delete(kvsUrl + '/upload/' + game.video.guid)

                    .error(function() {

                        throw new Error('Problem deleting canceled video from KVS');
                    });
                })

                .error(function() {

                    $scope.uploading = false;

                    throw new Error('Request for KVS URL failed');
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
            $window.krossover = $window.krossover || {};
            $window.krossover.videoUploadStatus = 'COMPLETE';
            $scope.$apply();
        });

        $scope.headings = {
            opposingTeam: 'Opposing Team',
            yourTeam: 'Team',
            scoutingTeam: 'Scouting'
        };
    }
]);

