/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Academics page module.
 * @module EditProfile.Academics
 */
var Academics = angular.module('Athlete.EditProfile.Academics');

/**
 * EditProfile.Academics controller.
 * @module EditProfile.Academics
 * @name EditProfile.Academics.controller
 * @type {controller}
 */
Academics.controller('Athlete.EditProfile.Academics.controller', [
    '$scope', 'UsersFactory', 'SessionService', 'Athlete.EditProfile.Data',
    function controller($scope, users, session, data) {
        $scope.athlete = users.get(session.getCurrentUserId());
    }
]);
