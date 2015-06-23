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
 * @name byDateAssigned
 * @type {Filter}
 */
Games.filter('filterByUserDeadlineAndTime',
    ['SessionService',
        function(session) {
            return game => game.indexerAssignments.filter(function(assignment) {

                const currentUser = session.getCurrentUserId();
                const userSession = game.isAssignedToUser(currentUser, assignment);
                const checkDeadline = game.deadlinePassed();
                const timeFinished = game.isAssignmentCompleted(assignment);
                let mostRecentAssignment;

                /* Check if the game is assigned to that user, if the
                 * game in question has already passed the deadline
                 * and if the game was finished indexing
                 */
                if(userSession && checkDeadline && timeFinished) {

                    return assignment;
                } else if(userSession && checkDeadline) {

                    return game.userAssignment(currentUser);
                }

            });
        }
    ]
);

/**
 * Games filter.
 * @module Games
 * @name byDeadline
 * @type {Filter}
 */
Games.filter('filterByDeadline',
    ['SessionService',
        function(session) {
            return function(games, gamePage) {
                return games.filter(game => game.indexerAssignments.some(function(assignment) {

                    /* Check if a game is assigned to that user, and depending
                     * on the page type, check whether the game has passed its
                     * deadline or not
                     */
                    const currentUser = session.getCurrentUserId();
                    const userSession = game.isAssignedToUser(currentUser, assignment);
                    const checkDeadline = game.deadlinePassed();
                    let deadline = gamePage ? !checkDeadline : checkDeadline;

                    return userSession && deadline;
                }));
            };
        }
    ]
);
