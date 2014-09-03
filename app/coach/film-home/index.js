

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome', [
    'ui.router',
    'ui.bootstrap',
    'coach-info',
    'roster',
    'film',
    'no-results'
]);

/* Cache the template files */
FilmHome.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/film-home/template.html', require('./template.html'));
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

        .state('Coach.FilmHome', {
            url: '/film-home',
            views: {
                'main@root': {
                    templateUrl: 'coach/film-home/template.html',
                    controller: 'Coach.FilmHome.controller'
                }
            },
            resolve: {
                'Coach.Data': ['$q', 'Coach.Data.Dependencies', 'Coach.FilmHome.ReelsData', function($q, data, reelsData) {
                    angular.extend(data, reelsData);
                    return $q.all(data);
                }]
            }
        });
    }
]);

FilmHome.service('Coach.FilmHome.ReelsData', [
    '$q', 'SessionService', 'ReelsFactory',
    function($q, session, reels) {

        var teamId = session.currentUser.currentRole.teamId;
        var userId = session.currentUser.id;

        var Data = {
            reels: reels.load({
                teamId: teamId,
                userId: userId
            }),
        };

        return Data;
    }
]);

/* File dependencies */
require('./controller');
