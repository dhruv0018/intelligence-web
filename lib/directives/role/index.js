/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Role
 * @module Role
 */
var Role = angular.module('role', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * Role directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Role.directive('krossoverRole', [
    'ROLES', 'UsersFactory', 'TeamsFactory',
    function directive(ROLES, users, teams) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: {

                user: '=',
                role: '='
            },

            templateUrl: 'lib/directives/role/template.html',

            link: function($scope, element, attributes) {
                $scope.COACH = ROLES.COACH;
                $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
                $scope.HEAD_COACH = ROLES.HEAD_COACH;

                $scope.users = users;

                $scope.teams = teams.getCollection();
            }
        };

        return role;
    }
]);

/**
 * RoleListItem directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Role.directive('krossoverRoleListItem', [
    'ROLES', 'UsersFactory', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory',
    function directive(ROLES, users, teams, leagues, sports) {

        var indexedSports = null;
        var indexedLeagues = null;

        var role = {

            controller: function($scope, $element, $attrs) {
                if (!indexedSports) {
                    indexedSports = {};
                    sports.getList({}, function(sportsItems) {
                        sportsItems.forEach(function(sport) {
                            indexedSports[sport.id] = sport;
                        });
                    });
                }
                if (!indexedLeagues) {
                    indexedLeagues = {};
                    leagues.getList({}, function(leaguesItems) {
                        leaguesItems.forEach(function(league) {
                            indexedLeagues[league.id] = league;
                        });
                    });
                }
                $scope.indexedLeagues = indexedLeagues;
                $scope.indexedSports = indexedSports;
            },

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: {
                user: '=',
                userrole: '=role'
            },

            templateUrl: 'lib/directives/role/roleListItem.html',

            link: function($scope, element, attributes) {
                /**
                 * currentClass is a class attribute to indicate the role is
                 * current to user. Defaulting to "current" since non team
                 * roles such as admin and indexers should be considered
                 * current
                 */
                $scope.currentClass = 'current';

                $scope.role = angular.copy($scope.userrole);

                if ($scope.role.teamId) {

                    teams.get($scope.role.teamId, function(team) {
                        $scope.role.team = team;

                        if ($scope.indexedSports[$scope.indexedLeagues[team.leagueId].sportId]) {
                            $scope.role.sport = $scope.indexedSports[$scope.indexedLeagues[team.leagueId].sportId].name;
                        }

                    });

                    $scope.role.tenureRange = '';
                    $scope.role.isCurrent = false;
                    if ($scope.role.tenureStart === null && $scope.role.tenureEnd === null) {
                        $scope.role.tenureRange = 'Current';
                        $scope.role.isCurrent = true;
                    } else if ($scope.role.tenureStart !== null && $scope.role.tenureEnd === null) {
                        $scope.role.tenureRange = $scope.role.tenureStart + ' to Current';
                        $scope.role.isCurrent = true;
                    } else if ($scope.role.tenureStart !== null && $scope.role.tenureEnd !== null) {
                        $scope.role.tenureRange = $scope.role.tenureStart + ' to ' + $scope.role.tenureEnd;
                        $scope.role.currentClass = 'not-current';
                    }

                }
            }
        };

        return role;
    }
]);

export default Role;
