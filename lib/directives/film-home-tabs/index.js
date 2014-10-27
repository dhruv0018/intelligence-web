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
                //Temporary hide for reels
                scope.reelsActive = config.reels.turnedOn;

                var gamesList = games.getList();

                if (scope.reelsActive && !session.currentUser.is(ROLES.ATHLETE)) {

                    var reelsList = reels.getList();

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
                } else {

                    scope.filters = {
                        all: {
                            items: gamesList,
                            selected: true,
                            isAll: true,
                            description: 'All'
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
                }

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
