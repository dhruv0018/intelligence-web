/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * RoleClass
 * @module RoleClass
 */
var RoleClass = angular.module('RoleClass');

/**
 * RoleClass Controller
 * @module RoleClass
 * @name RoleClass
 * @type {Controller}
 */
RoleClass.controller('RoleClass.Controller', [
    '$scope', 'SessionService',
    function controller($scope, session) {

        $scope.session = session;

        this.formatClassName = function(roleName) {
            return roleName.replace(/\s/g, '-').toLowerCase() + '-role';
        };
    }
]);
