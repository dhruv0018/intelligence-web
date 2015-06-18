/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * ArenaEvents
 * @module ArenaEvents
 */
const ArenaEvents = angular.module('ArenaEvents.Filter', []);

/**
 * Films filter.
 * @module Films
 * @name nameOfTheFilm
 * @type {Filter}
 */
ArenaEvents.filter('arenaEventsFilter', [function () {

    return function (arenaEvents, filters) {

        if (!angular.isUndefined(arenaEvents) && !angular.isUndefined(filters)) {

            var tempArenaEvents = [];
            angular.forEach(arenaEvents, function (arenaEvent) {

                if (filters.shots.made) {

                    if (arenaEvent.isMade) tempArenaEvents.push(arenaEvent);
                }

                if (filters.shots.missed) {

                    if (!arenaEvent.isMade) tempArenaEvents.push(arenaEvent);
                }
            });

            return tempArenaEvents;

        } else {

            return arenaEvents;
        }
    };
}]);
