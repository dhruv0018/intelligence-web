/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * User info controller. Controls the view for a users info.
 * @module Users
 * @name User.Info.Controller
 * @type {Controller}
 */
Users.controller('Users.User.Info.Controller', [
    '$scope', 'ROLES', 'SessionService', 'AlertsService', 'Users.User.Service',
    function controller($scope, ROLES, session, alerts, user) {

    }
]);

