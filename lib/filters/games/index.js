/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Games
 * @module Games
 */
var Games = angular.module('Games.Filter', []);

/**
 * Games filter.
 * @module Games
 * @name isNotDeletedGame
 * @type {Filter}
 */

Games.filter('isNotDeletedGame',
    ['SessionService',
        function(session) {
            return function(games) {
                return games.filter(function(game) {
                    return !game.isDeleted;
            });
        };
    }]
);

/**
 * Games filter.
 * @module Games
 * @name isNotSetAside
 * @type {Filter}
 */
Games.filter('isNotSetAside',
    ['SessionService', 'GAME_STATUSES',
        function(session, GAME_STATUSES) {
            return function(games) {
                return games.filter(function(game) {
                    return game.status != GAME_STATUSES.SET_ASIDE.id;
            });
        };
    }]
);

/**
 * Games filter.
 * @module Games
 * @name userHasGameAssignment
 * @type {Filter}
 */
Games.filter('userHasGameAssignment',
    ['SessionService',
        function(session) {
            return function(games) {
                return games.filter(function(game) {
                    const currentUser = session.getCurrentUserId();
                    return !!game.userAssignment(currentUser);
                });
            };
        }]
);

/**
 * Games filter.
 * @module Games
 * @name userAssignmentIsActive
 * @type {Filter}
 */
Games.filter('userAssignmentIsActive',
    ['SessionService',
        function(session) {
            return function(games, gamePage) {
                return games.filter(function(game) {
                    const deadlinePassed = game.deadlinePassed();
                    return (gamePage) ? !deadlinePassed : deadlinePassed;
                });
            };
        }]
);
