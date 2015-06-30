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
 * @name gameIsDeleted
 * @type {Filter}
 */

gameIsDeleted.$inject = [
    'SessionService'
];

function gameIsDeleted (
    session
) {
    return (games, flag) => games.filter(game => (game.isDeleted === flag));
}

/**
 * Games filter.
 * @module Games
 * @name gameIsNotSetAside
 * @type {Filter}
 */

gameIsNotSetAside.$inject = [
    'SessionService',
    'GAME_STATUSES'
];

function gameIsNotSetAside (
    session,
    GAME_STATUSES
) {
    return (games) => games.filter(game => (game.status != GAME_STATUSES.SET_ASIDE.id));
}

/**
 * Games filter.
 * @module Games
 * @name gameHasCurrentUserAssignment
 * @type {Filter}
 */

gameHasCurrentUserAssignment.$inject = [
    'SessionService',
];

function gameHasCurrentUserAssignment (
    session,
    GAME_STATUSES
) {
    return (games) => games.filter(function(game) {
        const currentUser = session.getCurrentUserId();
        return !!game.userAssignment(currentUser);
    });
}

/**
 * Games filter.
 * @module Games
 * @name gameCurrentUserAssignmentIsActive
 * @type {Filter}
 */
gameCurrentUserAssignmentIsActive.$inject = [
    'SessionService',
];

function gameCurrentUserAssignmentIsActive (
    session,
    GAME_STATUSES
) {
    return (games, flag) => games.filter(function(game) {

        const currentAssignment = game.currentAssignment();
        const currentUser = session.getCurrentUserId();
        const deadlinePassed = game.deadlinePassed();

        if(flag) {

            /*If the current assignment is assigned to the current user,
             *check if the deadline has passed or not and if timeFinished is null.
             */
            return (currentAssignment.userId === currentUser) &&
                    (deadlinePassed !== flag) &&
                    (currentAssignment.timeFinished === null);
        } else {

            /*Check if the current assignment is not equal to the last assignment
             *of the user or if the current assignment is equal to the user's last
             *assignment but it is past the deadline, then the game should be part
             *of the history page
             */
            const lastAssignmentForUser = game.userAssignment(currentUser);
            const deadline = moment.utc(lastAssignmentForUser.deadline);
            return (currentAssignment.id !== lastAssignmentForUser.id) ||
                    (currentAssignment.id === lastAssignmentForUser.id && deadline.isBefore());
        }
    });
}

Games.filter('gameIsDeleted', gameIsDeleted);
Games.filter('gameIsNotSetAside', gameIsNotSetAside);
Games.filter('gameHasCurrentUserAssignment', gameHasCurrentUserAssignment);
Games.filter('gameCurrentUserAssignmentIsActive', gameCurrentUserAssignmentIsActive);
