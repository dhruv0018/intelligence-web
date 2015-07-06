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

    return function(arenaEvents, query) {

        if (!angular.isUndefined(arenaEvents) && !angular.isUndefined(query)) {

            let filteredArenaEvents = arenaEvents.filter((arenaEvent) => {

                /* shots */

                let inShotsFilter = false;

                /* If both made and missed are not set at the same time, include arena event*/
                if (!query.shots.made && !query.shots.missed) {

                    inShotsFilter = true;

                } else {

                    if (query.shots.made) {

                        if (arenaEvent.isMade) inShotsFilter = true;

                    }

                    if (query.shots.missed) {

                        if (!arenaEvent.isMade) inShotsFilter = true;

                    }
                }


                /* periods */

                let inPeriodFilter = false;

                /* If all periods are not set at the same time, include arena event */
                if (!query.period.one &&
                    !query.period.two &&
                    !query.period.three &&
                    !query.period.four &&
                    !query.period.overtime) {

                        inPeriodFilter = true;

                } else {

                    if (query.period.one) {

                        if (arenaEvent.period === '1') inPeriodFilter = true;
                    }

                    if (query.period.two) {

                        if (arenaEvent.period === '2') inPeriodFilter = true;
                    }

                    if (query.period.three) {

                        if (arenaEvent.period === '3') inPeriodFilter = true;
                    }

                    if (query.period.four) {

                        if (arenaEvent.period === '4') inPeriodFilter = true;
                    }

                    if (query.period.overtime) {

                        if (arenaEvent.period === 'OT') inPeriodFilter = true;
                    }
                }


                /* Custom Tags */

                let inCustomTagsFilter = false;

                if (!query.customTagIds.length) {

                    inCustomTagsFilter = true;

                } else if (arenaEvent.customTagIds && arenaEvent.customTagIds.length){

                    inCustomTagsFilter = arenaEvent.customTagIds.some((arenaEventCustomTagId) => {

                        return query.customTagIds.some((customTagId) => {

                            return arenaEventCustomTagId === customTagId;
                        });
                    });
                }


                /* Players */

                let inTeamPlayersFilter = false;
                let inOpposingTeamPlayersFilter = false;

                if (arenaEvent.teamId === query.teamId) {

                    /* Team Players */
                    if (!query.teamPlayersIds.length) {

                        inTeamPlayersFilter = true;

                    } else {

                        inTeamPlayersFilter = query.teamPlayersIds.some((playerId) => {

                            return arenaEvent.playerId === playerId;
                        });
                    }

                } else if (arenaEvent.teamId === query.opposingTeamId) {

                    /* Opposing Team Players */
                    if (!query.opposingTeamPlayersIds.length) {

                        inOpposingTeamPlayersFilter = true;

                    } else {

                        inOpposingTeamPlayersFilter = query.opposingTeamPlayersIds.some((playerId) => {

                            return arenaEvent.playerId === playerId;
                        });
                    }
                }

                if (inShotsFilter &&
                    inPeriodFilter &&
                    inCustomTagsFilter &&
                    (inTeamPlayersFilter || inOpposingTeamPlayersFilter)) {

                    return true;
                }
            });

            return filteredArenaEvents;
        }
    };
}

Arenas.filter('arenaEvents', ArenaEventsFilter);
