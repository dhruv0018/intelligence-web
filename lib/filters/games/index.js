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

        /*Check if the current assignment is not equal to the last assignment
         *of the user or if the current assignment is equal to the user's last
         *assignment but it is past the deadline, then the game should be part
         *of the history page
         */
        const lastAssignmentForUser = game.userAssignment(currentUser);
        //If false, then you know the user isn't working on an active assignment for the game
        const checkIfOldUserAssignment = currentAssignment.id !== lastAssignmentForUser.id;

        const deadline = moment.utc(lastAssignmentForUser.deadline);
        //If false, then you know the active assignment's deadline has passed or
        //the user has already completed the assignment before the deadline
        const checkIfCurrentUserAssignment = (currentAssignment.id === lastAssignmentForUser.id) &&
                                            (deadline.isBefore() || currentAssignment.timeFinished !== null);

        //If either are true, the game should appear in the history page otherwise active
        return (checkIfOldUserAssignment || checkIfCurrentUserAssignment) !== flag;

    });
}

Games.filter('gameIsDeleted', gameIsDeleted);
Games.filter('gameIsNotSetAside', gameIsNotSetAside);
Games.filter('gameHasCurrentUserAssignment', gameHasCurrentUserAssignment);
Games.filter('gameCurrentUserAssignmentIsActive', gameCurrentUserAssignmentIsActive);
