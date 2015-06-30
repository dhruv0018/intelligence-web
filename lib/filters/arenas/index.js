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

                if (inShotsFilter && inPeriodFilter) {

                    return true;
                }
            });

            return filteredArenaEvents;
        }
    };
}

Arenas.filter('arenaEvents', ArenaEventsFilter);
