/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Teams page module.
 * @module Teams
 */
var Teams = angular.module('teams', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/* Cache the template file */
Teams.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('team.html', require('./team.html'));
        $templateCache.put('teams.html', require('./teams.html'));
        $templateCache.put('team-info.html', require('./team-info.html'));
        $templateCache.put('team-members.html', require('./team-members.html'));
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
                    'main@root': {
                        templateUrl: 'teams.html',
                        controller: 'TeamsController'
                    }
                }
            })

            .state('team', {
                url: '/team/:id',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'team.html',
                        controller: 'TeamController'
                    }
                }
            })

            .state('team-info', {
                url: '',
                parent: 'team',
                views: {
                    'content@team': {
                        templateUrl: 'team-info.html',
                        controller: 'TeamController'
                    }
                }
            })

            .state('team-members', {
                url: '',
                parent: 'team',
                views: {
                    'content@team': {
                        templateUrl: 'team-members.html',
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
    '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'ROLES', 'UsersFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesResource', 'SchoolsResource',
    function controller($rootScope, $scope, $state, $stateParams, $filter, ROLES, users, teams, sports, leagues, schools) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;

        if ($stateParams.id) {

            teams.get($stateParams.id, function(team) {

                $scope.team = team;
                $scope.members = $scope.team.getMembers();

                leagues.get({ id: team.leagueId }, function(league) {

                    $scope.sportId = league.sportId;
                });
            });
        }

        $scope.indexedSports = {};
        $scope.sports = sports.getList({}, function(sports){
            sports.forEach(function(sport){
                $scope.indexedSports[sport.id] = sport;
            });
            return sports;
        });

        $scope.leagues = leagues.query();
        $scope.schools = schools.query();

        $scope.$watch('addNewHeadCoach', function() {

            if ($scope.addNewHeadCoach) {

                $scope.users = users.getList();
            }
        });

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

        $scope.formatUser = function(user) {

            if (!user) return '';

            var firstName = user.firstName || '';
            var lastName = user.lastName || '';
            var email = user.email || '';

            return firstName + ' ' + lastName + ' - ' + email;
        };

        $scope.addHeadCoach = function(coach) {

            var newCoachRole = ROLES.HEAD_COACH;
            newCoachRole.userId = coach.id;
            newCoachRole.teamId = $scope.team.id;
            newCoachRole.tenureStart = $filter('date')(new Date(), 'yyyy-M-d');
            coach.addRole(newCoachRole);
            coach.save();
            $scope.team.roles = $scope.team.roles || [];
            $scope.team.roles.push(newCoachRole);
            $scope.addNewHeadCoach = false;
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
    '$rootScope', '$scope', '$state', 'TeamValue', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, team, teams, sports, leagues, schools) {
        
        $scope.indexedLeagues = {};
        $scope.indexedSports = {};
        $scope.indexedSchools = {};
        $scope.sports = sports.getList({}, function(sports){
            sports.forEach(function(sport){
                $scope.indexedSports[sport.id] = sport;
            });
            return sports;
        });
        $scope.leagues = leagues.getList({}, function(leagues){
            leagues.forEach(function(league){
                $scope.indexedLeagues[league.id] = league;
            });
            return leagues;
        });
        $scope.schools = schools.getList({}, function(schools){
            schools.forEach(function(school){
                $scope.indexedSchools[school.id] = school;
            });
            return schools;
        });
        $scope.teams = teams.getList();
        
        $scope.search = function(filter) {
            teams.getList(filter,
                    function(teams){
                        $scope.teams = teams;
                        $scope.noResults = false;
                    },
                    function(){
                        $scope.teams = [];
                        $scope.noResults = true;
                    }
            );
        };
    }
]);

