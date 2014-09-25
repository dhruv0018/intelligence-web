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
                    qcontroller: 'UploadingFilmController'
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

        $scope.headings = {
            opposingTeam: 'Opposing Team',
            yourTeam: 'Team',
            scoutingTeam: 'Scouting'
        };
    }
]);

