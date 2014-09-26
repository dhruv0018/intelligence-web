/* Component settings */
var templateUrl = 'coach/add-film/upload.html';

/* Component resources */
var template = require('./upload.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Upload film page module.
 * @module UploadFilm
 */
var UploadFilm = angular.module('upload-film', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
UploadFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Upload film page state router.
 * @module UploadFilm
 * @type {UI-Router}
 */
UploadFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var uploadFilm = {
            name: 'upload-film',
            parent: 'add-film',
            url: '',
            views: {
                'content@add-film': {
                    templateUrl: 'coach/add-film/upload.html',
                    controller: 'UploadFilmController'
                }
            }
        };

        $stateProvider.state(uploadFilm);
    }
]);

/**
 * UploadFilm controller.
 * @module UploadFilm
 * @name UploadFilmController
 * @type {Controller}
 */
UploadFilm.controller('UploadFilmController', [
    'config', 'ALLOWED_FILE_EXTENSIONS', '$rootScope', '$scope', '$state', '$http', 'AlertsService', 'SessionService', 'GamesFactory', 'Coach.Data',
    function controller(config, ALLOWED_FILE_EXTENSIONS, $rootScope, $scope, $state, $http, alerts, session, games, coachData) {
        $scope.games = games;
        $scope.data = coachData;
        console.log(coachData.game);
    }
]);
