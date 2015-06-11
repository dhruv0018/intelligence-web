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


Game.filter('byTimeFinished',
    ['SessionService',
        function(session) {
            return function(games) {
                return games.filter(function(game) {
                    return game.indexerAssignments.some(function(assignment) {
                        return assignment.timeFinished && assignment.userId === session.currentUser.id;
                    });
                });
            };
        }
    ]
);

Game.filter('byTimeFinishedAndDate',
    ['SessionService',
        function(session) {
            return function(games) {
                return games.filter(function(game) {
                    return game.indexerAssignments.some(function(assignment) {
                        console.log(moment(assignment.timeAssigned).utc());
                        console.log(moment.utc());
                        console.log(moment(assignment.timeAssigned).utc().isAfter(moment.utc()));
                        return !assignment.timeFinished && assignment.userId === session.currentUser.id && moment(assignment.timeAssigned).utc().isAfter(moment.utc());
                    });
                });
            };
        }
    ]
);
