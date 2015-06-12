/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Games
 * @module Games
 */
var Game = angular.module('Game.Filter', []);

/**
 * Films filter.
 * @module Films
 * @name nameOfTheFilm
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
                    return assignment.userId === session.currentUser.id && !moment(assignment.deadline).utc().isAfter(moment.utc()) && assignment.timeFinished !== null;
                });
            };
        }
    ]
);

Game.filter('isQa',
    ['SessionService',
        function(session) {
            return function(game) {
                return game.indexerAssignments.some(function(assignment) {
                    if(assignment.userId === session.currentUser.id && !moment(assignment.deadline).utc().isAfter(moment.utc()) && assignment.timeFinished !== null) {
                        return assignment;
                    }
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
                    return assignment.userId === session.currentUser.id && !moment(assignment.deadline).utc().isAfter(moment.utc()) && assignment.timeFinished !== null;
                });
            };
        }
    ]
);

Game.filter('byDeadlineForGames',
    ['SessionService',
        function(session) {
            return function(games) {
                return games.filter(function(game) {
                    return game.indexerAssignments.some(function(assignment) {
                        return assignment.userId === session.currentUser.id && moment(assignment.deadline).utc().isAfter(moment.utc());
                    });
                });
            };
        }
    ]
);

Game.filter('byDeadlineForHistory',
    ['SessionService',
        function(session) {
            return function(games) {
                return games.filter(function(game) {
                    return game.indexerAssignments.some(function(assignment) {
                        return assignment.userId === session.currentUser.id && !moment(assignment.deadline).utc().isAfter(moment.utc());
                    });
                });
            };
        }
    ]
);
