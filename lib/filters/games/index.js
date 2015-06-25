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
        const deadlinePassed = game.deadlinePassed();
        return deadlinePassed !== flag;
    });
}

Games.filter('gameIsDeleted', gameIsDeleted);
Games.filter('gameIsNotSetAside', gameIsNotSetAside);
Games.filter('gameHasCurrentUserAssignment', gameHasCurrentUserAssignment);
Games.filter('gameCurrentUserAssignmentIsActive', gameCurrentUserAssignmentIsActive);
