/* Component dependencies */
import FilmHomeController from './controller';
import GamesController from './games/controller';
import FilterDirective from './games/filter';
import * as DataDependencies from './data';

import ReelsController from './reels/controller';

/* Template paths */
const FilmHomeTemplateUrl = 'app/film-home/template.html';
const GamesTemplateUrl = 'app/film-home/games/template.html';
const ReelsTemplateUrl = 'app/film-home/reels/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
const FilmHome = angular.module('FilmHome', [
    'ui.router',
    'ui.bootstrap'
]);

FilmHome.factory('FilmHomeGamesDataDependencies', DataDependencies.FilmHomeGames);
FilmHome.factory('FilmHomeReelsDataDependencies', DataDependencies.FilmHomeReels);
FilmHome.controller('FilmHomeController', FilmHomeController);
FilmHome.filter('numKeys', function(){
    return function(json){
        let total = 0;
        angular.forEach(json, item =>{
            if (item){
                total++;
            }
        });
        return total;
    };
});

FilmHome.directive('gameFilter', FilterDirective);

/**
 * FilmHome page state router.
 * @module FilmHome
 * @type {UI-Router}
 */
FilmHome.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('FilmHome', {
                url: '/film-home',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: FilmHomeTemplateUrl,
                        controller: FilmHomeController
                    }
                }
            })

            .state('FilmHomeGames', {
                url: '',
                parent: 'FilmHome',
                views: {
                    'content@FilmHome': {
                        templateUrl: GamesTemplateUrl,
                        controller: GamesController
                    }
                },
                resolve: {
                    'FilmHomeGames.Data': [
                        '$q', 'FilmHomeGamesDataDependencies',
                        function($q, FilmHomeGamesDataDependencies) {
                            return $q.all(FilmHomeGamesDataDependencies);
                        }
                    ]
                }
            })

            .state('FilmHomeReels', {
                url: '',
                parent: 'FilmHome',
                views: {
                    'content@FilmHome': {
                        templateUrl: ReelsTemplateUrl,
                        controller: ReelsController
                    }
                },
                resolve: {
                    'FilmHomeReels.Data': [
                        '$q', 'FilmHomeReelsDataDependencies',
                        function($q, FilmHomeReelsDataDependencies) {
                            let data = new FilmHomeReelsDataDependencies();
                            return $q.all(data);
                        }
                    ]
                }
            });
        }
    ]);

export default FilmHome;
