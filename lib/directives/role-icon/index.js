/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Role Icon Placeholder
 * @module Role Icon Placeholder
 */
var RoleIcon = angular.module('RoleIcon', []);

/**
 * Role Icon Placeholder directive.
 * @module Role Icon Placeholder
 * @name Role Icon Placeholder
 * @type {Directive}
 */
RoleIcon.directive('roleIcon', [
    function directive() {

        var roleicon = {

            restrict: TO += ELEMENTS,

            scope: {

                user: '=',
                role: '='
            },

            controller: 'RoleIcon.controller',

            templateUrl: 'lib/directives/role-icon/template.html',

            link: function($scope, element, attributes) {
            }
        };

        return roleicon;
    }
]);

/**
 * Role icon controller.
 * @module RoleIcon
 * @name RoleIcon.controller
 * @type {controller}
 */
RoleIcon.controller('RoleIcon.controller', [
    '$scope', 'ROLES', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($scope, ROLES, sports, leagues, teams, users) {

        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;
        $scope.INDEXER = ROLES.INDEXER;
        $scope.COACH = ROLES.COACH;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.FILM_EXCHANGE_ADMIN = ROLES.FILM_EXCHANGE_ADMIN;

        $scope.users = users;

        $scope.sports = sports.getCollection();
        $scope.leagues = leagues.getCollection();
        $scope.teams = teams.getCollection();
    }
]);

export default RoleIcon;
