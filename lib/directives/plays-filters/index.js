/* Constants */
var TO = '';
var ELEMENTS = 'E';

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

/**
 * Plays Filters directive.
 * @module Plays Filter
 * @name Plays Filter
 * @type {Directive}
 */
PlaysFilters.directive('playsFilters', [
    'PlaysFactory',
    'PlayersFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'FiltersetsFactory',
    'CustomtagsFactory',
    'SessionService',
    'AnalyticsService',
    'PlaylistEventEmitter',
    'FILTERSET_CATEGORY_TYPES',
    'FILTERSET_CATEGORY_TYPES_IDS',
    'CUSTOM_TAGS_EVENTS',
    function directive(
        plays,
        players,
        teams,
        leagues,
        filtersets,
        customtags,
        session,
        analytics,
        playlistEventEmitter,
        FILTERSET_CATEGORY_TYPES,
        FILTERSET_CATEGORY_TYPES_IDS,
        CUSTOM_TAGS_EVENTS
    ) {

        var playsFilters = {

            restrict: TO += ELEMENTS,

            templateUrl: 'lib/directives/plays-filters/template.html',

            link: {
                pre: pre,
                post: post
            },
            scope: {
                game: '=',
                filteredPlaysIds: '=ngModel'
            }
        };

        function pre(scope) {

            const playsFilter = { gameId: scope.game.id };
            scope.totalPlays = plays.getList(playsFilter);
            scope.searchFilter = {};

            let team = teams.get(scope.game.uploaderTeamId);
            let league = leagues.get(team.leagueId);
            scope.filterset = filtersets.get(league.filterSetId);
            scope.teamId = scope.game.teamId;

            // Get game roster and players for my team
            // NOTE: Do not assume that the players are on the teams roster, but rather get the players from the game roster
            let teamRoster = scope.game.getRoster(scope.game.teamId);
            let teamPlayerList = players.getList(scope.game.id).filter(player => teamRoster.playerInfo[player.id]);
            teamPlayerList = players.sortPlayerList(teamPlayerList, teamRoster);

            // Get game roster and players for opposing team
            let opposingTeamRoster = scope.game.getRoster(scope.game.opposingTeamId);
            let opposingPlayerList = players.getList(scope.game.id).filter(player => opposingTeamRoster.playerInfo[player.id]);
            opposingPlayerList = players.sortPlayerList(opposingPlayerList, opposingTeamRoster);

            scope.allCustomTags = customtags.getList();

            playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, event => {
                scope.allCustomTags = customtags.getList();
                updateCustomTags(scope.allCustomTags);
            });

            //Check to see if user is on team
            scope.isTeamMember = false;
            if (session.getCurrentTeamId() === team.id) scope.isTeamMember = true;

            //Filtersets
            let exclusion = [];

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

            /* Create a map of all the filters, keyed by ID. */
            let filterMap = new Map();
            scope.filterset.filters.forEach(filter => filterMap.set(filter.id, filter));

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

                if (filter.name === 'CustomTags') {
                    scope.customtagsFilterTemplate = filter;
                    exclusion.push(filter.id);
                }

                if (filter.name === 'Unknown Players') {
                    exclusion.push(filter.id);
                }

                var excluded = exclusion.some(function(excludedFilterId) {
                    return filter.id === excludedFilterId;
                });

                if (!excluded) {

                    if (filter.children && filter.children.length) {

                        /* Map children from IDs to objects. */
                        filter.children = filter.children.map(childId => filterMap.get(childId));
                    }

                    scope.filtersetCategories[filter.filterCategoryId].subFilters.push(filter);
                }

            });

            let playerNumber = 1;
            angular.forEach(opposingPlayerList, function(player) {
                let name = player.lastName ? `${player.firstName[0]}. ${player.lastName}` : `Player ${playerNumber++}`;
                let playerName = name;
                if (opposingTeamRoster.playerInfo[player.id].jerseyNumber) {
                    playerName = '#' + opposingTeamRoster.playerInfo[player.id].jerseyNumber + ' ' + name;
                }
                let playerFilter = {
                    id: scope.playerFilterTemplate.id,
                    teamId: scope.game.opposingTeamId,
                    playerId: player.id,
                    name: playerName,
                    filterCategoryId: scope.playerFilterTemplate.filterCategoryId,
                    customFilter: true
                };
                scope.filtersetCategories[playerFilter.filterCategoryId].subFilters.push(playerFilter);
            });

            playerNumber = 1;
            angular.forEach(teamPlayerList, function(player) {
                let name = player.lastName ? `${player.firstName[0]}. ${player.lastName}` : `Player ${playerNumber++}`;
                let playerName = name;
                if (teamRoster.playerInfo[player.id].jerseyNumber) {
                    playerName = '#' + teamRoster.playerInfo[player.id].jerseyNumber + ' ' + name;
                }
                let playerFilter = {
                    id: scope.playerFilterTemplate.id,
                    teamId: scope.teamId,
                    playerId: player.id,
                    name: playerName,
                    filterCategoryId: scope.playerFilterTemplate.filterCategoryId,
                    customFilter: true
                };
                scope.filtersetCategories[playerFilter.filterCategoryId].subFilters.push(playerFilter);
            });

            updateCustomTags(scope.allCustomTags);

            function updateCustomTags(tags) {
                scope.customTagsList = tags.filter(tag => tag.teamId === team.id);

                /* Clear list of tags before re-adding them */
                scope.filtersetCategories[scope.customtagsFilterTemplate.filterCategoryId].subFilters = [];

                /* Sort tags alphabetically */
                scope.customTagsList.sort((a, b) => a.name.localeCompare(b.name));

                angular.forEach(scope.customTagsList, function(tag) {
                    // Custom tags to be shown for my team
                    let customTagsFilter = {
                        id: scope.customtagsFilterTemplate.id,
                        teamId: scope.teamId,
                        customTagId: tag.id,
                        name: tag.name,
                        filterCategoryId: scope.customtagsFilterTemplate.filterCategoryId,
                        customFilter: true
                    };
                    scope.filtersetCategories[customTagsFilter.filterCategoryId].subFilters.push(customTagsFilter);

                    // Custom tags to be shown for opposing team
                    let opposingCustomTagsFilter = {
                        id: scope.customtagsFilterTemplate.id,
                        teamId: scope.game.opposingTeamId,
                        customTagId: tag.id,
                        name: tag.name,
                        filterCategoryId: scope.customtagsFilterTemplate.filterCategoryId,
                        customFilter: true
                    };
                    scope.filtersetCategories[opposingCustomTagsFilter.filterCategoryId].subFilters.push(opposingCustomTagsFilter);
                });
            }
        }

        function post(scope) {
            scope.teams = teams.getCollection();
            scope.newFilteredPlays = [];
            scope.activeFilters = [];
            scope.currentFilterCategory = scope.filterset.categories[0].id;
            scope.filterMenu = {
                isOpen: false
            };

            scope.contains = function(activeFilters, filter) {

                return activeFilters.some(function(activeFilter) {

                    if (activeFilter.customFilter) {
                        if (activeFilter.playerId) {
                            return filter.playerId === activeFilter.playerId;
                        } else if (activeFilter.customTagId) {
                            return filter.customTagId === activeFilter.customTagId;
                        }
                    } else {
                        return filter.id === activeFilter.id;
                    }
                });
            };

            scope.clearFilters = function() {
                scope.activeFilters = [];
            };

            scope.$watch('activeFilters', function(activeFilters) {
                // When activeFilters is cleared, set the plays back to the total plays
                if (activeFilters.length === 0) {
                    // Remove all previously applied filters
                    clearFilteredPlaysIds();
                    // 'Filter' on all plays to show totalPlays
                    scope.totalPlays
                    .filter(play => play.hasVisibleEvents)
                    .forEach(function(play) {
                        scope.filteredPlaysIds.push(play.id);
                    });
                } else if (activeFilters.length > 0) {
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

                        scope.recursiveFilter(scope.remainingFilters);
                    }

                }
            }, true);

            scope.recursiveFilter = function(activeFilters) {
                if (activeFilters.length === 0 || scope.resources.plays.length === 0) {
                    // Clear existing filteredPlaysIds before updating with new filtered plays
                    clearFilteredPlaysIds();

                    for (var i in scope.newFilteredPlays) {

                        var filteredPlayId = scope.newFilteredPlays[i].id;
                        scope.filteredPlaysIds.push(filteredPlayId);
                    }
                    return;
                }

                var currentFilter = activeFilters.shift();

                if (currentFilter.playerId) {
                    scope.resources.playerId = currentFilter.playerId;
                } else if (currentFilter.customTagId) {
                    scope.resources.customTagId = currentFilter.customTagId;
                }

                var filterPlaysFilter = { filterId: currentFilter.id };
                plays.filterPlays(filterPlaysFilter, scope.resources, function(filteredPlays) {

                    scope.newFilteredPlays = filteredPlays[scope.game.id];
                    scope.resources = {
                        game: scope.game,
                        plays: scope.newFilteredPlays,
                        teamId: scope.teamId
                    };

                    return scope.recursiveFilter(activeFilters);
                });

            };

            scope.setFilter = function(filter) {

                let isFilterActive = scope.contains(scope.activeFilters, filter);

                if (!isFilterActive) {
                    scope.activeFilters.push(filter);
                    scope.filterMenu.isOpen = false;
                }

                scope.searchFilter = {}; // Reset searchbar

                analytics.track('Filter Applied', {
                    'Filter Name': filter.name
                });
            };

            scope.setTeam = function($event, teamId) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.filterMenu.isOpen = true;

                scope.teamId = teamId;
            };

            scope.setFilterCategory = function($event, filterCategory) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.filterMenu.isOpen = true;

                scope.currentFilterCategory = filterCategory;
                scope.searchFilter = {}; // Reset searchbar
            };

            scope.removeFilter = function(index) {
                scope.activeFilters.splice(index, 1);
            };

            function clearFilteredPlaysIds() {
                while (scope.filteredPlaysIds.length > 0) {
                    scope.filteredPlaysIds.pop();
                }
            }
        }

        return playsFilters;
    }
]);

export default PlaysFilters;
