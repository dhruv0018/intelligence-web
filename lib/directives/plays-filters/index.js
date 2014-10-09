/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Plays Filters
 * @module Plays Filter
 */
var PlaysFilters = angular.module('PlaysFilters', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
PlaysFilters.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('plays-filter.html', template);
    }
]);

/**
 * Plays Filters directive.
 * @module Plays Filter
 * @name Plays Filter
 * @type {Directive}
 */
PlaysFilters.directive('playsFilter', [
    'PlaysFactory', 'TeamsFactory', 'FILTERSET_CATEGORY_TYPES', 'FILTERSET_CATEGORY_TYPES_IDS',
    function directive(plays, teams, FILTERSET_CATEGORY_TYPES, FILTERSET_CATEGORY_TYPES_IDS) {

        var playsFilters = {

            restrict: TO += ELEMENTS,

            templateUrl: 'plays-filter.html',

            link: {
                pre: pre,
                post: post
            },
            scope: {
                filterset: '=',
                teamPlayerList: '=',
                opposingPlayerList: '=',
                game: '=',
                plays: '=',
                totalPlays: '='
            }
        };

        function pre(scope) {
            scope.teamId = scope.game.teamId;

            //collections
            scope.teams = teams.getCollection();

            //Filtersets
            var exclusion = [];

            scope.filtersetCategories = {};
            angular.forEach(scope.filterset.categories, function(filterCategory) {
                //TODO deal with player stuff later
                if (filterCategory.type === FILTERSET_CATEGORY_TYPES.QA.id) {
                    scope.qaCategoryId = filterCategory.id;
                } else {
                    scope.filtersetCategories[filterCategory.id] = filterCategory;
                }
            });
            scope.playerFilterTemplate = {};

            angular.forEach(scope.filterset.filters, function(filter) {

                if (filter.filterCategoryId === scope.qaCategoryId) {
                    return;
                }

                scope.filtersetCategories[filter.filterCategoryId].subFilters = scope.filtersetCategories[filter.filterCategoryId].subFilters || [];

                //TODO figure out a better way to deal with players at a later date
                if (filter.name === 'Player') {
                    scope.playerFilterTemplate = filter;
                    exclusion.push(filter.id);
                }

                if (filter.name === 'Unknown Players') {
                    exclusion.push(filter.id);
                }

                var excluded = exclusion.some(function(excludedFilterId) {
                    return filter.id === excludedFilterId;
                });

                if (!excluded) {
                    scope.filtersetCategories[filter.filterCategoryId].subFilters.push(filter);
                }

            });

            angular.forEach(scope.opposingPlayerList, function(player) {
                var playerFilter = {
                    id: scope.playerFilterTemplate.id,
                    teamId: scope.game.opposingTeamId,
                    playerId: player.id,
                    name: player.firstName[0] + '. ' + player.lastName,
                    filterCategoryId: scope.playerFilterTemplate.filterCategoryId,
                    customFilter: true
                };
                scope.filtersetCategories[playerFilter.filterCategoryId].subFilters.push(playerFilter);
            });

            angular.forEach(scope.teamPlayerList, function(player) {
                var playerFilter = {
                    id: scope.playerFilterTemplate.id,
                    teamId: scope.game.teamId,
                    playerId: player.id,
                    name: player.firstName[0] + '. ' + player.lastName,
                    filterCategoryId: scope.playerFilterTemplate.filterCategoryId,
                    customFilter: true
                };
                scope.filtersetCategories[playerFilter.filterCategoryId].subFilters.push(playerFilter);
            });

        }

        function post(scope) {
            scope.activeFilters = [];
            scope.currentFilterCategory = scope.filterset.categories[0].id;
            scope.filterMenu = {
                isOpened: false
            };

            scope.contains = function(activeFilters, filterId, playerId) {

                return activeFilters.some(function(filter) {

                    if (filter.customFilter) {
                        return playerId === filter.playerId;
                    } else {
                        return filterId === filter.id;
                    }
                });
            };

            scope.clearFilters  = function() {
                scope.activeFilters = [];
            };

            scope.$watch('activeFilters', function(activeFilters) {
                if (activeFilters.length === 0) {
                    scope.plays = scope.totalPlays;
                }

                if (activeFilters.length > 0) {
                    var recombining = false;

                    scope.resources = {
                        game: scope.game,
                        plays: scope.totalPlays,
                        teamId: scope.teamId
                    };

                    var lastFilter = activeFilters[activeFilters.length - 1];

                    if (lastFilter.id === scope.playerFilterTemplate.id && activeFilters.length > 1) {
                        var previousFilter = activeFilters[activeFilters.length - 2];

                        if (previousFilter.associatePlayer) {
                            recombining = true;
                            var uncombinedFilters = activeFilters.slice(-2);
                            var combinedFilter = {
                                id: uncombinedFilters[uncombinedFilters.length - 2].id,
                                teamId: uncombinedFilters[uncombinedFilters.length - 1].teamId,
                                playerId: uncombinedFilters[uncombinedFilters.length - 1].playerId,
                                name: uncombinedFilters[uncombinedFilters.length - 2].name + ' by ' + uncombinedFilters[uncombinedFilters.length - 1].name,
                                filterCategoryId: uncombinedFilters[uncombinedFilters.length - 1].filterCategoryId,
                                customFilter: true
                            };
                            activeFilters.splice(-2, 2, combinedFilter);
                        }

                    }

                    if (!recombining) {

                        scope.remainingFilters = [];

                        //TODO refactor this when we have time
                        angular.forEach(scope.activeFilters, function(filter) {
                            scope.remainingFilters.push(filter);
                        });

                        scope.plays = scope.recursiveFilter(scope.remainingFilters);
                    }

                }
            }, true);

            scope.recursiveFilter = function(activeFilters) {
                if (activeFilters.length === 0 || scope.resources.plays.length === 0) {
                    return scope.plays;
                }

                var currentFilter = activeFilters.shift();

                if (currentFilter.playerId) {
                    scope.resources.playerId = currentFilter.playerId;
                }


                plays.filterPlays({
                    filterId: currentFilter.id
                }, scope.resources, function(filteredPlays) {

                    filteredPlays[scope.game.id].forEach(function(play) {

                        play = plays.extend(play);
                    });

                    scope.plays = filteredPlays[scope.game.id];
                    scope.resources = {
                        game: scope.game,
                        plays: scope.plays,
                        teamId: scope.teamId
                    };


                    return scope.recursiveFilter(activeFilters);
                });

            };


            scope.setFilter = function(filter) {

                var isFilterActive = scope.contains(scope.activeFilters, filter.id, filter.playerId);

                if (!isFilterActive) {
                    scope.activeFilters.push(filter);
                    scope.filterMenu.isOpened = false;
                }

            };

            scope.setTeam = function(teamId) {
                scope.teamId = teamId;
            };

            scope.setFilterCategory = function(filterCategory) {
                scope.currentFilterCategory = filterCategory;
            };

            scope.removeFilter = function(index) {
                scope.activeFilters.splice(index, 1);
            };
        }

        return playsFilters;
    }
]);

