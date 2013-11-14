/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Teams page module.
 * @module Teams
 */
var Teams = angular.module('teams', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Teams.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('team.html', require('./team.html'));
        $templateCache.put('teams.html', require('./teams.html'));
    }
]);

/**
 * Teams page state router.
 * @module Teams
 * @type {UI-Router}
 */
Teams.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('teams', {
                url: '/teams',
                parent: 'base',
                views: {
                    'main@': {
                        templateUrl: 'teams.html',
                        controller: 'TeamsController'
                    }
                }
            })

            .state('team', {
                url: '/team/:id',
                parent: 'base',
                views: {
                    'main@': {
                        templateUrl: 'team.html',
                        controller: 'TeamController'
                    }
                }
            });
    }
]);

/**
 * Team value. Holds data for the current team.
 * @module Teams
 * @name TeamsValue
 * @type {Value}
 */
Teams.value('TeamValue', {

    data: null,

    set: function(team) {
        this.data = team;
    }
});

/**
 * Team controller. Controls the view for adding and editing a single team.
 * @module Teams
 * @name TeamController
 * @type {Controller}
 */
Teams.controller('TeamController', [
    '$rootScope', '$scope', '$state', '$stateParams', 'ROLES', 'UsersResource', 'TeamsFactory', 'SportsResource', 'LeaguesResource', 'SchoolsResource',
    function controller($rootScope, $scope, $state, $stateParams, ROLES, users, teams, sports, leagues, schools) {

        if ($stateParams.id) {

            teams.get($stateParams.id, function(team) {

                $scope.team = team;
                $scope.members = $scope.team.getMembers();
            });
        }

        $scope.sports = sports.query();
        $scope.leagues = leagues.query();
        $scope.schools = schools.query();

        $scope.$watch('team.schoolId', function() {

            if ($scope.team && $scope.team.schoolId) {

                $scope.school = schools.get({ id: $scope.team.schoolId }, function() {

                    $scope.team.address = angular.copy($scope.school.address);
                });
            }
        });

        $scope.onlyCurrentRoles = function(role) {

            /* Assume falsy value means the tenure end date hasn't been set yet. */
            if (!role.tenureEnd) return true;

            var tenureEnd = new Date(role.tenureEnd);

            /* Assume invalid date means the tenure end date hasn't been set yet. */
            if (isNaN(tenureEnd.getTime())) return true;

            return false;
        };

        $scope.onlyPastRoles = function(role) {

            if ($scope.onlyCurrentRoles(role)) return false;

            var today = new Date();
            var tenureEnd = new Date(role.tenureEnd);

            return today - tenureEnd > 0;
        };

        $scope.save = function() {

            var team = $scope.team;

            if (!team) return;

            teams.save(team);

            $state.go('teams');
        };
    }
]);

/**
 * Teams controller. Controls the view for displaying multiple teams.
 * @module Teams
 * @name TeamsController
 * @type {Controller}
 */
Teams.controller('TeamsController', [
    '$rootScope', '$scope', '$state', 'TeamValue', 'TeamsFactory',
    function controller($rootScope, $scope, $state, team, teams) {

        $scope.teams = teams.getAll();
    }
]);

