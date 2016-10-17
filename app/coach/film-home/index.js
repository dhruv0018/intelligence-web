/* Fetch angular from the browser scope */
var angular = window.angular;
const CoachFilmHomeTemplateUrl  = 'app/coach/film-home/template.html';

import CoachFilmHomeController from './controller';

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome', [
    'ui.router',
    'ui.bootstrap',
    'coach-info',
    'film',
    'no-results'
]);

/**
 * FilmHome page state router.
 * @module FilmHome
 * @type {UI-Router}
 */
FilmHome.config([
    '$stateProvider',
    '$urlRouterProvider',
    function config(
        $stateProvider,
        $urlRouterProvider
    ) {

        $stateProvider

        .state('Coach.FilmHome', {
            url: '/film-home',
            views: {
                'main@root': {
                    templateUrl: CoachFilmHomeTemplateUrl,
                    controller: CoachFilmHomeController
                }
            },
            resolve: {
                'Coach.Data': [
                    '$q', 'Coach.Data.Dependencies',
                    function($q, data) {

                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);
