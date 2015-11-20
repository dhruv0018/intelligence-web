/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Arenas Filter
 * @module Arenas.Filter
 */
const Arenas = angular.module('Arenas.Filter', []);

/**
 * ArenaEvents filter.
 * @module Arenas
 * @param {array} arenaEvents list of arenaEvent objects
 * @param {object} query - arenaEvents query
 */

ArenaEventsFilter.$inject = [];

function ArenaEventsFilter() {

    return function arenaEventsFilter(arenaEvents, query) {

        if (!arenaEvents) throw new Error(`Required parameter 'arenaEvents' is undefined`);
        if (!query) throw new Error(`Required parameter 'query' is undefined`);

        let specificShotFilter = true;
        let specificPeriodFilter = true;
        let specificCustomTagFilter = true;
        let specificTeamPlayersFilter = true;
        let specificOpposingTeamPlayersFilter = true;

        /* Determine which arena event filters are specifically set */

        if (query.shots.made && query.shots.missed && query.shots.saved && query.shots.blocked) {

            specificShotFilter = false;
        }

        // if allPeriods filter is set, no specific period is set
        if (query.allPeriods) {

            specificPeriodFilter = false;
        }

        if (!query.customTagIds.length) {

            specificCustomTagFilter = false;
        }

        if (!query.teamPlayersIds.length) {

            specificTeamPlayersFilter = false;
        }

        if (!query.opposingTeamPlayersIds.length) {

            specificOpposingTeamPlayersFilter = false;
        }

        // If no specific arena event filter is set, return all arena events
        if (!specificShotFilter &&
            !specificPeriodFilter &&
            !specificCustomTagFilter &&
            !specificTeamPlayersFilter &&
            !specificOpposingTeamPlayersFilter) {

            return arenaEvents;
        }

        /* NOTE: Some specific filters have been set, therefore progressively
         * filter out arena events that do not match the query and the
         * filtering rules.
         */
        const filteredArenaEvents = arenaEvents.filter(getFilteredArenaEvents);


        /* NOTE: Progressively filter out arena events that do not match the query
         * and the filtering rules. If the arena event has passed all of the rules
         * based on current query conditions, than the arena event will be
         * included in the filteredArenaEvents.
         */

        function getFilteredArenaEvents(arenaEvent) {

            /* shots */
            if (specificShotFilter &&
                !isArenaEventInShotsFilter(arenaEvent, query.shots)) return false;

            /* periods */
            if (specificPeriodFilter &&
                !isArenaEventInPeriodFilter(arenaEvent, query.periods)) return false;

            /* Custom Tags */
            if (specificCustomTagFilter &&
                !isArenaEventInCustomTagsFilter(arenaEvent, query.customTagIds)) return false;

            /* Players */

            /* NOTE: teamPlayer filter is defined but opposingTeamPlayer filter is not.
             * This is to hide the opposingTeamPlayer events while only showing the
             * teamPlayer specific events.
             */
            if (specificTeamPlayersFilter && !specificOpposingTeamPlayersFilter &&
                !isArenaEventInTeamPlayersFilter(arenaEvent, query.teamPlayersIds)) return false;

            /* NOTE: opposingTeamPlayer filter is defined but teamPlayer filter is not
             * This is to hide the teamPlayer events while only showing the
             * opposingTeamPlayer specific events.
             */
            else if (specificOpposingTeamPlayersFilter && !specificTeamPlayersFilter &&
                !isArenaEventInTeamPlayersFilter(arenaEvent, query.opposingTeamPlayersIds)) return false;

            // Both team filter and opposingTeam filters are set
            else if (specificTeamPlayersFilter && specificOpposingTeamPlayersFilter &&
                arenaEvent.teamId === query.teamId &&
                !isArenaEventInTeamPlayersFilter(arenaEvent, query.teamPlayersIds)) return false;

            else if (specificTeamPlayersFilter && specificOpposingTeamPlayersFilter &&
                arenaEvent.teamId === query.opposingTeamId &&
                !isArenaEventInTeamPlayersFilter(arenaEvent, query.opposingTeamPlayersIds)) return false;

            return true;
        }

        return filteredArenaEvents;
    };
}

function isArenaEventInShotsFilter(arenaEvent, shotsQuery) {

    if (arenaEvent.isMade && shotsQuery.made) {
        return true;
    } else if (!arenaEvent.isMade && shotsQuery.missed) {
        return true;
    } else if (arenaEvent.isSaved && shotsQuery.saved) {
        return true;
    } else if (!arenaEvent.isSaved && shotsQuery.blocked) {
        return true;
    } else {
        return false;
    }
}

function isArenaEventInPeriodFilter(arenaEvent, periods) {

    if (periods[arenaEvent.period]) return true;
    else return false;
}

function isArenaEventInCustomTagsFilter(arenaEvent, customTagsFilter) {

    return arenaEvent.customTagIds.some((arenaEventCustomTagId) => {

        return customTagsFilter.some((customTagId) => {

            return arenaEventCustomTagId === customTagId;
        });
    });
}

function isArenaEventInTeamPlayersFilter(arenaEvent, teamPlayersFilter) {

    return teamPlayersFilter.some((playerId) => {

        return arenaEvent.playerId === playerId;
    });
}

Arenas.filter('arenaEvents', ArenaEventsFilter);
