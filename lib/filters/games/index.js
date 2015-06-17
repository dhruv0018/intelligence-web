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
Games.filter('byUserDeadlineTime',
    ['SessionService',
        function(session) {
            return game => game.indexerAssignments.filter(function(assignment) {

                const userSession = assignment.userId === session.currentUser.id;
                const checkDeadline = !moment(assignment.deadline).utc().isAfter(moment.utc());
                const timeFinished = assignment.timeFinished !== null;
                let mostRecentAssignment;

                /* Check if the game is assigned to that user, if the
                 * game in question has already passed the deadline
                 * and if the game was finished indexing
                 */
                if(userSession && checkDeadline && timeFinished) {

                    return assignment;
                } else if(userSession && checkDeadline) {

                    /* If the game was not finished indexing, find the most
                     * recent game the user indexed in case there are multiple
                     * assignments.
                     */

                    if(!mostRecentAssignment) {

                        mostRecentAssignment = assignment;
                    } else {

                        // Check if another asisgnment was given more recently
                        const mostRecentTimeAssigned = moment(mostRecentAssignment.timeAssigned).utc();
                        const timeAssigned = moment(assignment.timeAssigned).utc();

                        // There was a newer assignment
                        if(mostRecentTimeAssigned.isAfter(timeAssigned)) {
                            mostRecentAssignment = assignment;
                        }
                    }

                }

                // Return the most recent assignment for that user
                return mostRecentAssignment;
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
Games.filter('byDeadline',
    ['SessionService',
        function(session) {
            return function(games, gamePage) {
                return games.filter(game => game.indexerAssignments.some(function(assignment) {

                    /* Check if a game is assigned to that user, and depending
                     * on the page type, check whether the game has passed its
                     * deadline or not
                     */
                    const userSession = assignment.userId === session.currentUser.id;
                    const checkDeadline = moment(assignment.deadline).utc().isAfter(moment.utc());
                    let deadline = gamePage ? checkDeadline : !checkDeadline;
                    return userSession && deadline;
                }));
            };
        }
    ]
);
