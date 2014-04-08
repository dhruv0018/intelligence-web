/* Component dependencies. */
require('plan');
require('../athlete');


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
    'athlete',
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
            parent: 'coach',
            views: {
                'main@root': {
                    templateUrl: 'coach/add-film/template.html',
                    controller: 'AddFilmController'
                },
                'content@add-film': {
                    templateUrl: 'coach/add-film/start.html',
                    controller: 'AddFilmController'
                }
            },
            onExit: [
                'AlertsService',
                function(alerts) {

                    alerts.clear();
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
    '$scope', '$state', 'PlayersFactory',
    function controller($scope, $state, players) {
        $scope.athletes = [];
        $scope.rosterId = '157';

        players.getList({
            roster: $scope.rosterId
        }, function(data){
            $scope.roster = data;
        });

    }
]);

