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
                },
                onExit: function($localStorage) {

                    /* Delete the local team when exiting the state. */
                    delete $localStorage.team;
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
 * Team controller. Controls the view for adding and editing a single team.
 * @module Teams
 * @name TeamPlanController
 * @type {Controller}
 */
Teams.controller('TeamPlansController', [
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', '$filter', '$modal', 'ROLES', 'UsersFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesResource', 'SchoolsResource',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, $filter, $modal, ROLES, users, teams, sports, leagues, schools) {

        $scope.team = $scope.$storage.team;
        console.log('teamClicked' + $scope.team);

        var openPackageModal = function(editTeamPackageObjIndex) {
            var modalInstance = $modal.open({
                scope: $scope,
                size: 'sm',
                templateUrl: 'app/admin/teams/team-package/team-package.html',
                controller: 'TeamPackageController',
                resolve: {
                    Team: function() { return $scope.team; },
                    PackageIndex: function() { return editTeamPackageObjIndex; }
                }
            });

            modalInstance.result.then(function(teamWithPackagesToSave) {
                console.log('res', teamWithPackagesToSave);
                console.log($scope);
                $scope.save(teamWithPackagesToSave);
            });
        };

        $scope.addNewPlan = function() {

            $modal.open({

                templateUrl: 'app/admin/teams/team-plan/team-plan.html',
                controller: 'TeamPlanController',
                resolve: {
                    Team: function() { return $scope.team; }
                }
            });
        };

        $scope.addNewPackage = function() {
            openPackageModal();
        };

        $scope.editLastPackage = function() {
            openPackageModal($scope.team.teamPackages.length - 1);
        };

        $scope.removeLastPackage = function() {
            $scope.team.teamPackages.splice($scope.team.teamPackages.length - 1, 1);
            $scope.save();
        };

        $scope.save = function(team) {

            teams.save(team).then(function() {
                delete $scope.$storage.team;
                $state.go('teams');
            });
        };
    }
]);

/**
 * Team controller. Controls the view for adding and editing a single team.
 * @module Teams
 * @name TeamController
 * @type {Controller}
 */
Teams.controller('TeamController', [
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', '$filter', 'ROLES', 'UsersFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesResource', 'SchoolsResource',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, $filter, ROLES, users, teams, sports, leagues, schools) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;

        $scope.$storage = $localStorage;

        var team = $scope.$storage.team;

        /* If no team is stored locally, then get the team from the server. */
        if (!team) {

            var teamId = $stateParams.id;

            if (teamId) {

                teams.get(teamId, function(team) {

                    $scope.$storage.team = team;
                    $scope.$storage.team.members = team.getMembers();
                    $scope.$storage.team.league = leagues.get({ id: team.leagueId });
                });
            }
        }

        $scope.$watch('$storage.team.league.sportId', function(sportId) {

            $scope.sportId = sportId;
        });

        $scope.indexedSports = {};
        $scope.sports = sports.getList({}, function(sports) {
            sports.forEach(function(sport) {
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

        $scope.$watch('$storage.team.schoolId', function() {

            if ($scope.$storage.team && $scope.$storage.team.schoolId) {

                $scope.school = schools.get({ id: $scope.$storage.team.schoolId }, function() {

                    $scope.$storage.team.address = angular.copy($scope.school.address);
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

        $scope.save = function(team) {

            teams.save(team).then(function() {
                delete $scope.$storage.team;
                $state.go('teams');
            });
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
    '$rootScope', '$scope', '$state', '$localStorage', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, $localStorage, teams, sports, leagues, schools) {

        $scope.indexedLeagues = {};
        $scope.indexedSports = {};
        $scope.indexedSchools = {};
        $scope.sports = sports.getList({}, function(sports) {
            sports.forEach(function(sport) {
                $scope.indexedSports[sport.id] = sport;
            });
            return sports;
        });
        $scope.leagues = leagues.getList({}, function(leagues) {
            leagues.forEach(function(league) {
                $scope.indexedLeagues[league.id] = league;
            });
            return leagues;
        });
        $scope.schools = schools.getList({}, function(schools) {
            schools.forEach(function(school) {
                $scope.indexedSchools[school.id] = school;
            });
            return schools;
        });
        $scope.teams = teams.getList();

        $scope.add = function() {

            delete $localStorage.team;
            $state.go('team-info');
        };

        $scope.search = function(filter) {
            teams.getList(filter,
                    function(teams) {
                        $scope.teams = teams;
                        $scope.noResults = false;
                    },
                    function() {
                        $scope.teams = [];
                        $scope.noResults = true;
                    }
            );
        };
    }
]);

