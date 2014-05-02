/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Role Icon Placeholder
 * @module Role Icon Placeholder
 */
var roleIcon = angular.module('role-icon', []);

/* Cache the template file */
roleIcon.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('role-icon.html', template);
    }
]);

/**
 * Role Icon Placeholder directive.
 * @module Role Icon Placeholder
 * @name Role Icon Placeholder
 * @type {Directive}
 */
roleIcon.directive('roleIcon', [
    'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'SessionService',
    function directive(sports, leagues, teams, session) {

        var roleicon = {

            restrict: TO += ELEMENTS,

            controller: 'RoleIconController',

            templateUrl: 'role-icon.html',

            link: function($scope, element, attributes) {
                $scope.role = session.currentUser.currentRole;

                sports.getList(function(sports) { $scope.sports = sports; }, null, true);
                leagues.getList(function(leagues) { $scope.leagues = leagues; }, null, true);
                teams.getList(function(teams) { $scope.teams = teams; }, null, true);
            }
        };

        return roleicon;
    }
]);

/**
 * Role Icon controller.
 * @module Role Icon
 * @name RoleIconController
 * @type {Controller}
 */
roleIcon.controller('RoleIconController', [
    '$scope', 'SessionService', 'ROLES',
    function controller($scope, session, ROLES) {

        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;
        $scope.INDEXER = ROLES.INDEXER;
        $scope.COACH = ROLES.COACH;

        $scope.currentUser = session.currentUser;

    }
]);