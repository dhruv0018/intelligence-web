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
    '$scope', '$state', '$localStorage', 'SessionService', 'GamesFactory',
    function controller($scope, $state, $localStorage, session, games) {

        /* TODO: Get actual GUID. */
        var GUID = 'asdfj0912e309rejakldsfm90';

        $scope.$storage = $localStorage;
        $scope.$storage.game = {};
        $scope.$storage.game.guid = GUID;
        delete $scope.$storage.opposingTeam;
    }
]);

