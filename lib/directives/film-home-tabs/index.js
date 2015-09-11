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
    'SessionService', 'GamesFactory', 'ReelsFactory', 'GAME_TYPES', 'ROLES', 'config',
    function directive(session, games, reels, GAME_TYPES, ROLES, config) {

        var filmHomeTabs = {

            restrict: TO += ELEMENTS,
            templateUrl: 'film-home-tabs.html',
            scope: {
                films: '=ngModel'
            },
            replace: true,
            link: function(scope, element, attrs) {

                var gamesList = games.getByRelatedRole();
                var reelsList = reels.getByRelatedRole();

                scope.filters = {
                    all: {
                        items: gamesList.concat(reelsList),
                        selected: true,
                        isAll: true,
                        description: 'All',
                        id: 'filter-film-all-cta'
                    },
                    reels: {
                        items: reelsList,
                        selected: false,
                        description: 'Reels',
                        id: 'filter-film-reels-cta'
                    },
                    regular: {
                        items: gamesList.filter(function(game) {

                            if (game.isSharedWithCurrentUser()) {

                                return false;
                            }

                            return game.gameType === GAME_TYPES.CONFERENCE.id || game.gameType === GAME_TYPES.NON_CONFERENCE.id;
                        }),
                        selected: false,
                        description: 'Regular',
                        id: 'filter-film-regular-cta'
                    },
                    breakdown: {
                        items: gamesList.filter(function(game) {

                            let breakdownIsAvailable =
                                game.isSharedWithCurrentUser() ?
                                game.getShareByCurrentUser().isBreakdownShared :
                                true;

                            return game.isDelivered() ? breakdownIsAvailable : false;
                        }),
                        selected: false,
                        description: 'Breakdown',
                        id: 'filter-film-breakdown-cta'
                    },
                    scouting: {
                        items: gamesList.filter(function(game) {

                            if (game.isSharedWithCurrentUser()) {

                                return false;
                            }

                            return game.gameType === GAME_TYPES.SCOUTING.id;
                        }),
                        selected: false,
                        description: 'Scouting',
                        id: 'filter-film-scouting-cta'
                    },
                    scrimmage: {
                        items: gamesList.filter(function(game) {

                            if (game.isSharedWithCurrentUser()) {

                                return false;
                            }

                            return game.gameType === GAME_TYPES.SCRIMMAGE.id;
                        }),
                        selected: false,
                        description: 'Scrimmage',
                        id: 'filter-film-scrimmage-cta'
                    },
                    shared: {
                        items: gamesList.concat(reelsList).filter(function(film) {

                            if ((film.description === 'games') || (film.description === 'reels')) {
                                return film.isSharedWithUser(session.currentUser) || film.isSharedWithTeamId(session.currentUser.currentRole.teamId);
                            }
                            else return false;
                        }),
                        selected: false,
                        description: 'Shared With Me',
                        id: 'filter-film-shared-with-me-cta'
                    }
                };

                scope.currentFilter = scope.filters.all; // Default filter is All

                scope.selectFilter = function(filter) {
                    if (scope.currentFilter) {
                        // Unselect current filter
                        scope.currentFilter.selected = false;
                    }

                    // Store selected filter so that you can unselect later
                    scope.currentFilter = filter;
                    scope.currentFilter.selected = true;

                    // Fetch films for selected filter
                    var filteredFilms = [];
                    angular.forEach(filter.items, function(item) {
                        if (filteredFilms.indexOf(item) === -1) {
                            filteredFilms.push(item);
                        }
                    });

                    scope.films = filteredFilms;
                };
            }

        };

        return filmHomeTabs;
    }
]);
