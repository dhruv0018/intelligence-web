/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Achievements page module.
 * @module EditProfile.Achievements
 */
var Achievements = angular.module('Athlete.Profile.EditProfile.Achievements');

/*
* EditProfile.Achievements dependencies
*/
achievementsController.$inject = [
    '$scope'
];

/**
 * EditProfile.Achievements controller.
 * @module EditProfile.Achievements
 * @name EditProfile.Achievements.controller
 * @type {controller}
 */
function achievementsController (
    $scope
) {
    //TODO: remove controller if unused
}

Achievements.controller('Athlete.Profile.EditProfile.Achievements.controller', achievementsController);

export default achievementsController;
