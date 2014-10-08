/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHomeTabs
 * @module FilmHomeTabs
 */
var FilmHomeTabs = angular.module('FilmHomeTabs', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
FilmHomeTabs.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('film-home-tabs.html', require('./template.html'));
    }
]);

/**
 * FilmHomeTabs directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
FilmHomeTabs.directive('filmHomeTabs', [
    'SessionService', 'GamesFactory', 'ReelsFactory', 'GAME_TYPES',
    function directive(session, games, reels, GAME_TYPES) {

        var filmHomeTabs = {

            restrict: TO += ELEMENTS,
            templateUrl: 'film-home-tabs.html',
            scope: {
                films: '='
            },
            replace: true,
            link: function(scope, element, attrs) {
                var reelsList = reels.getList();
                var gamesList = games.getList();

                scope.filters = {
                    all: {
                        items: reelsList.concat(gamesList),
                        selected: true,
                        isAll: true,
                        description: 'All'
                    },
                    reels: {
                        items: reelsList,
                        selected: false,
                        description: 'Reels'
                    },
                    regular: {
                        items: gamesList.filter(function(game) {
                            return game.gameType === GAME_TYPES.CONFERENCE.id && !game.isSharedWithUser(session.currentUser) || game.gameType === GAME_TYPES.NON_CONFERENCE.id;
                        }),
                        selected: false,
                        description: 'Regular'
                    },
                    breakdown: {
                        items: gamesList.filter(function(game) {
                            return game.isDelivered() && !game.isSharedWithUser(session.currentUser);
                        }),
                        selected: false,
                        description: 'Breakdown'
                    },
                    scouting: {
                        items: gamesList.filter(function(game) {
                            return game.gameType === GAME_TYPES.SCOUTING.id && !game.isSharedWithUser(session.currentUser);
                        }),
                        selected: false,
                        description: 'Scouting'
                    },
                    scrimmage: {
                        items: gamesList.filter(function(game) {
                            return game.gameType === GAME_TYPES.SCRIMMAGE.id && !game.isSharedWithUser(session.currentUser);
                        }),
                        selected: false,
                        description: 'Scrimmage'
                    },
                    shared: {
                        items: gamesList.filter(function(game) {
                            return game.isSharedWithUser(session.currentUser);
                        }),
                        selected: false,
                        description: 'Shared With Me'
                    }
                };

                scope.selectedFilters = [scope.filters.all];

                scope.selectFilter = function(filter) {
                    if (filter.selected) {
                        filter.selected = false;
                        scope.selectedFilters.splice(scope.selectedFilters.indexOf(filter), 1);
                    } else {
                        if (!filter.isAll) {
                            if (scope.selectedFilters.indexOf(scope.filters.all) >= 0) {
                                scope.filters.all.selected = false;
                                scope.selectedFilters.splice(scope.selectedFilters.indexOf(scope.filters.all), 1);
                            }
                        } else {
                            angular.forEach(scope.filters, function(filter) {
                                filter.selected = false;
                            });
                            scope.selectedFilters = [];
                        }
                        filter.selected = true;
                        scope.selectedFilters.push(filter);
                    }
                };

                scope.$watchCollection('selectedFilters', function(selectedFilters) {
                    var filteredFilms = [];
                    if (selectedFilters.length === 0) {
                        scope.selectFilter(scope.filters.all);
                    }
                    scope.selectedFilters.forEach(function(filter) {
                        angular.forEach(filter.items, function(item) {
                            if (filteredFilms.indexOf(item) === -1) {
                                filteredFilms.push(item);
                            }
                        });
                    });
                    scope.films = filteredFilms;
                });
            }

        };

        return filmHomeTabs;
    }
]);
