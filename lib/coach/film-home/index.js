

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
                }
            });
    }
]);

FilmHome.service('Coach.FilmHome.GameFilters', ['GAME_TYPES', function (otherFiltersConfiguration) {
    var filtersData = {
        filters: {
            'all': true,
            'others': {}
        },
        othersDisabled: true,
        disableOthers: function () {

            Object.keys(this.filters.others).forEach(function(filterName) {

                this.filters.others[filterName] = false;

            }, this);

            this.othersDisabled = true;
        },
        watchOthers: function () {

            this.othersDisabled = Object.keys(this.filters.others).every(function(filterName) {

                return !this.filters.others[filterName];

            }, this);

            this.filters.all = this.othersDisabled;
        },
        listEnabled: function () {

            var enabledFilters = Object.keys(this.filters.others).filter(function(filterName) {
                return this.filters.others[filterName] === true;
            }, this);

            return enabledFilters;
        }
    };

    angular.forEach(otherFiltersConfiguration, function (filter) {
        this.filters.others[filter.filter] = false;
    }, filtersData);

    return filtersData;
}]);

FilmHome.filter('gameFilter', ['Coach.FilmHome.GameFilters', function (filters) {

    return function(games, options) {
        if (options.all === true) {
            return games;
        }

        var filteredCollection = [];

        angular.forEach(games, function(game) {
            angular.forEach(filters.listEnabled(), function(filter) {
                if (game.filterType === filter) {
                    filteredCollection.push(game);
                }
            });
        });

        return filteredCollection;
    };

}]);

/* File dependencies */
require('./controller');
