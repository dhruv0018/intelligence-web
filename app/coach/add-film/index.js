/* File dependencies. */
require('./upload.js');
require('./uploading.js');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Film page module.
 * @module AddFilm
 */
var AddFilm = angular.module('add-film', [
    'ui.router',
    'ui.bootstrap',
    'plan',
    'upload-film',
    'uploading-film'
]);

/* Cache the template file */
AddFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/add-film/template.html', require('./template.html'));
        $templateCache.put('coach/add-film/start.html', require('./start.html'));
    }
]);

/**
 * Add Film page state router.
 * @module AddFilm
 * @type {UI-Router}
 */
AddFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var addFilm = {
            name: 'add-film',
            url: '/add-film',
            parent: 'Coach',
            views: {
                'main@root': {
                    templateUrl: 'coach/add-film/template.html',
                    controller: 'AddFilmController'
                },
                'content@add-film': {
                    templateUrl: 'coach/add-film/start.html',
                    controller: 'StartController'
                }
            },
            resolve: {
                'Coach.Game.Data': 'Coach.Game.Data'
            },
            onExit: [
                'Coach.Game.Data', 'Coach.Game.Tabs',
                function(gameData, tabs) {
                    delete gameData.opposingTeam;
                    delete gameData.team;

                    tabs.reset();
                }
            ]
        };

        $stateProvider.state(addFilm);
    }
]);

/**
 * AddFilm controller.
 * @module AddFilm
 * @name AddFilmController
 * @type {Controller}
 */
AddFilm.controller('AddFilmController', [
    '$scope', '$state',
    function controller($scope, $state, games) {
        $scope.games = games;
        $scope.game = {};
    }
]);

AddFilm.controller('StartController', [
    '$scope', 'GAME_TYPES',
    function($scope, GAME_TYPES) {
        $scope.GAME_TYPES = GAME_TYPES;
    }
]);

