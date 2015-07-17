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

        if (arenaEvents && query) {

            if (query.allArenaEvents) return arenaEvents;

            let anyShot = false;
            let anyPeriod = false;
            let anyCustomtag = false;
            let anyTeamPlayer = false;
            let anyOpposingTeamPlayer = false;

            /* If both made and missed are not set at the same time, include arena event*/
            if (!query.shots.made && !query.shots.missed) {

                anyShot = true;
            }

            if (!query.period.one &&
                !query.period.two &&
                !query.period.three &&
                !query.period.four &&
                !query.period.overtime) {

                anyPeriod = true;
            }

            if (!query.customTagIds.length) {

                anyCustomtag = true;
            }

            if (!query.teamPlayersIds.length) {

                anyTeamPlayer = true;
            }

            if (!query.opposingTeamPlayersIds.length) {

                anyOpposingTeamPlayer = true;
            }

            if (anyShot &&
                anyPeriod &&
                anyCustomtag &&
                anyTeamPlayer &&
                anyOpposingTeamPlayer) {

                return arenaEvents;
            }

            let filteredArenaEvents = arenaEvents.filter((arenaEvent) => {

                let included = false;

                /* shots */

                if (!anyShot) {

                    if (arenaEvent.isMade && query.shots.made) {
                        included = true;
                    } else if (!arenaEvent.isMade && query.shots.missed) {
                        included = true;
                    } else {
                        return false;
                    }
                }


                /* periods */

                /* If all periods are not set at the same time, include arena event */
                if (!anyPeriod) {

                    if (arenaEvent.period === '1' && query.period.one) {
                        included = true;
                    } else if (arenaEvent.period === '2' && query.period.two) {
                        included = true;
                    } else if (arenaEvent.period === '3' && query.period.three) {
                        included = true;
                    } else if (arenaEvent.period === '4' && query.period.four) {
                        included = true;
                    } else if (arenaEvent.period === 'OT' && query.period.overtime) {
                        included = true;
                    } else {
                        return false;
                    }
                }


                /* Custom Tags */

                if (!anyCustomtag) {

                    included = arenaEvent.customTagIds.some((arenaEventCustomTagId) => {

                        return query.customTagIds.some((customTagId) => {

                            return arenaEventCustomTagId === customTagId;
                        });
                    });

                    if (!included) return false;
                }

                /* Players */

                /* Team Players */

                if (!anyTeamPlayer && anyOpposingTeamPlayer) {

                    if (arenaEvent.teamId === query.teamId) {

                        included = query.teamPlayersIds.some((playerId) => {

                            return arenaEvent.playerId === playerId;
                        });

                        if (!included) return false;

                    } else {

                        return false;
                    }

                } else if (!anyOpposingTeamPlayer && anyTeamPlayer) {

                    if (arenaEvent.teamId === query.opposingTeamId) {

                        /* Opposing Team Players */
                        included = query.opposingTeamPlayersIds.some((playerId) => {

                            return arenaEvent.playerId === playerId;
                        });

                        if (!included) return false;

                    } else {

                        return false;
                    }

                } else if (!anyTeamPlayer || !anyOpposingTeamPlayer) {

                    if (arenaEvent.teamId === query.teamId) {

                        included = query.teamPlayersIds.some((playerId) => {

                            return arenaEvent.playerId === playerId;
                        });

                        if (!included) return false;

                    } else if (arenaEvent.teamId === query.opposingTeamId) {

                        /* Opposing Team Players */
                        included = query.opposingTeamPlayersIds.some((playerId) => {

                            return arenaEvent.playerId === playerId;
                        });

                        if (!included) return false;
                    }
                }

                return included;
            });

            return filteredArenaEvents;
        }
    };
}

function ArenaEventsMadeFilter() {

    return function(arenaEvents, isMade) {

        if (!isMade) return arenaEvents;

        let filteredArenaEventShots = arenaEvents.filter((arenaEvent) => {

            if (arenaEvent.isMade) return true;
        });

        return filteredArenaEventShots;
    };
}

Arenas.filter('arenaEventsMade', ArenaEventsMadeFilter);

Arenas.filter('arenaEvents', ArenaEventsFilter);
