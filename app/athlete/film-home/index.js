/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Athlete.FilmHome', [
    'ui.router',
    'ui.bootstrap',
    'film',
    'no-results'
]);

/* Cache the template files */
FilmHome.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/film-home/template.html', require('./template.html'));
    }
]);

/**
 * FilmHome page state router.
 * @module FilmHome
 * @type {UI-Router}
 */
FilmHome.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Athlete.FilmHome', {
            url: '/film-home',
            views: {
                'main@root': {
                    templateUrl: 'athlete/film-home/template.html',
                    controller: 'Athlete.FilmHome.controller'
                }
            },
            resolve: {
                'Athlete.Data': [
                    '$q', 'Athlete.Data.Dependencies',
                    function($q, data) {

                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

/* File dependencies */
require('./controller');

