/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Games
 * @module Games
 */
var Game = angular.module('Game.Filter', []);

/**
 * Games filter.
 * @module Games
 * @name byDateAssigned
 * @type {Filter}
 */


Game.filter('byDateAssigned',
    ['SessionService',
        function(session) {
            return function(game) {
                return game.indexerAssignments.filter(function(assignment) {
                    let dateAssignedAssignment;
                    if(assignment.userId === session.currentUser.id && !moment(assignment.deadline).utc().isAfter(moment.utc()) && assignment.timeFinished !== null) {
                        return assignment;
                    } else if(assignment.userId === session.currentUser.id) {
                        if(!dateAssignedAssignment || moment(dateAssignedAssignment.timeAssigned).utc().isAfter(moment(assignment.timeAssigned).utc())) {
                            dateAssignedAssignment = assignment;
                        }
                    }
                    return dateAssignedAssignment;
                });
            };
        }
    ]
);


Game.filter('byTimeFinishedAndDate',
    ['SessionService',
        function(session) {
            return function(game) {
                return game.indexerAssignments.some(function(assignment) {

                    const userSession = assignment.userId === session.currentUser.id;
                    const checkDeadline = !moment(assignment.deadline).utc().isAfter(moment.utc());
                    const timeFinished = assignment.timeFinished !== null;
                    return userSession && checkDeadline && timeFinished;
                });
            };
        }
    ]
);

Game.filter('byDeadline',
    ['SessionService',
        function(session) {
            return function(games, gamePage) {
                return games.filter(game => game.indexerAssignments.some(function(assignment) {

                    const userSession = assignment.userId === session.currentUser.id;
                    const checkDeadline = moment(assignment.deadline).utc().isAfter(moment.utc());
                    let deadline = gamePage ? checkDeadline : !checkDeadline;
                    return userSession && deadline;
                }));
            };
        }
    ]
);
