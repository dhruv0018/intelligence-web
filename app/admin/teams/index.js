/* Fetch angular from the browser scope */
var angular = window.angular;
require('team-plan');
require('team-package');

/**
 * Teams page module.
 * @module Teams
 */
var Teams = angular.module('teams', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide',
    'team-plan',
    'team-package'
]);

/* Cache the template file */
Teams.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('team.html', require('./team.html'));
        $templateCache.put('teams.html', require('./teams.html'));
        $templateCache.put('team-info.html', require('./team-info.html'));
        $templateCache.put('team-plans.html', require('./team-plans.html'));
        $templateCache.put('team-members.html', require('./team-members.html'));
        $templateCache.put('school-dropdown-input.html', require('./school-dropdown-input.html'));
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
                },
                resolve: {
                    'Teams.Data': [
                        '$q', 'Teams.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
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
                resolve: {
                    'Teams.Data': [
                        '$q', 'Teams.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
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
                },
                resolve: {
                    'Teams.Data': [
                        '$q', 'Teams.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
                }
            })

            .state('team-plans', {
                url: '',
                parent: 'team',
                views: {
                    'content@team': {
                        templateUrl: 'team-plans.html',
                        controller: 'TeamPlansController'
                    }
                },
                resolve: {
                    'Teams.Data': [
                        '$q', 'Teams.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
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

Teams.service('Teams.Data.Dependencies', [
    'TeamsFactory', 'LeaguesFactory', 'UsersFactory', 'SportsFactory',
    function(teams, leagues, users, sports) {

        var Data = {};

        angular.forEach(arguments, function(arg) {
            Data[arg.description] = arg.load();
        });

        return Data;

    }
]);


Teams.filter('visiblePlanOrPackage', [
    'NewDate',
    function(newDate) {

        return function visiblePlanOrPackageFilter(planOrPackageArray) {

            var currentDate = newDate.generateNow();
            var teamPackageOrPlan;

            planOrPackageArray = planOrPackageArray || [];
            var filteredItems = [];

            for (var i = 0; i < planOrPackageArray.length; i++) {
                planOrPackage = planOrPackageArray[i];

                if (typeof planOrPackage.endDate === 'string') {
                    planOrPackage.endDate = newDate.generatePlanEndDate(planOrPackage.endDate);
                    planOrPackage.startDate = newDate.generatePlanStartDate(planOrPackage.startDate);
                }

                if (typeof planOrPackage.endDate !== 'undefined' &&
                    planOrPackage.endDate >= currentDate) {

                    planOrPackage.unfilteredId = i;
                    filteredItems.push(planOrPackage);
                    break;
                }
            }

            return filteredItems;
        };
    }
]);

/**
 * Team controller. Controls the view for adding and editing a single team.
 * @module Teams
 * @name TeamPlanController
 * @type {Controller}
 */
Teams.controller('TeamPlansController', [
    '$scope', '$filter', '$modal', 'TeamsFactory', 'TURNAROUND_TIME_MIN_TIME_LOOKUP', 'BasicModals',
    function controller($scope, $filter, $modal, teams, minTurnaroundTimeLookup, basicModals) {

        $scope.minTurnaroundTimeLookup = minTurnaroundTimeLookup;

        $scope.team.teamPackages = $scope.team.teamPackages || [];
        $scope.team.teamPlans = $scope.team.teamPlans || [];

        function applyFilter() {
            $scope.filteredPackages = $filter('visiblePlanOrPackage')($scope.team.teamPackages);
            $scope.filteredPlans = $filter('visiblePlanOrPackage')($scope.team.teamPlans);
        }

        $scope.$watch(function() { return $scope.team.teamPlans; }, applyFilter, true);
        $scope.$watch(function() { return $scope.team.teamPackages; }, applyFilter, true);

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
                $scope.save(teamWithPackagesToSave);
            });
        };

        var openTeamPlanModal = function(teamPlanIndex) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/teams/team-plan/team-plan.html',
                controller: 'TeamPlanController',
                resolve: {
                    Team: function() { return $scope.team; },
                    TeamPlanIndex: function() { return teamPlanIndex; }
                }
            });

            modalInstance.result.then(function(teamWithPlansToSave) {
                $scope.save(teamWithPlansToSave);
            });
        };

        $scope.addNewPlan = function() {
            openTeamPlanModal();
        };

        $scope.addNewPackage = function() {
            openPackageModal();
        };

        $scope.editTeamPlan = function(index) {
            openTeamPlanModal(index);
        };

        $scope.editActivePackage = function(index) {
            openPackageModal(index);
        };

        $scope.removeActivePackage = function(packageIdToRemove) {
            var modalOptions = {
                title: 'Are you sure you want to delete this package?',
                buttonText: 'Yes, delete',
                cancelButtonText: 'No, cancel'
            };

            var modalInstance = basicModals.openForConfirm(modalOptions);

            modalInstance.result.then(function confirm() {
                //delete the package
                $scope.team.teamPackages.splice(packageIdToRemove, 1);
                $scope.save($scope.team);
            });
        };

        $scope.removeActivePlan = function(planIdToRemove) {
            var modalOptions = {
                title: 'Are you sure you want to delete this plan?',
                buttonText: 'Yes, delete',
                cancelButtonText: 'No, cancel'
            };

            var modalInstance = basicModals.openForConfirm(modalOptions);

            modalInstance.result.then(function confirm() {
                //delete the plan
                $scope.team.teamPlans.splice(planIdToRemove, 1);
                $scope.save($scope.team);
            });
        };

        $scope.save = function(team) {
            teams.save(team).then(function() {});
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
    '$rootScope', '$scope', '$state', '$stateParams', '$filter', '$modal', 'ROLES', 'Teams.Data', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, $stateParams, $filter, $modal, ROLES, data, schoolsFactory) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;

        $scope.sports = data.sports.getList();
        $scope.indexedSports = data.sports.getCollection();

        $scope.leagues = data.leagues.getList();
        $scope.indexedLeagues = data.leagues.getCollection();

        var team;
        $scope.schoolName = '';

        $scope.updateTeamAddress = function($item) {
            if ($item) {
                if (!$scope.team) {
                    $scope.team = {
                        schoolId: $item.id
                    };
                } else {
                    $scope.team.schoolId = $item.id;
                }

            }

            if ($scope.team && $scope.team.schoolId) {

                schoolsFactory.fetch($scope.team.schoolId).then(function(school) {
                    $scope.school = school;
                    $scope.schoolName = school.name;
                    $scope.team.address = angular.copy($scope.school.address);
                });
            }
        };

        /* If no team is stored locally, then get the team from the server. */
        if (!team) {

            var teamId = $stateParams.id;

            if (teamId) {

                team = data.teams.get(teamId);
                $scope.team = team;
                $scope.team.members = team.getMembers();

                $scope.sportId = data.leagues.get(team.leagueId).sportId;

                $scope.updateTeamAddress();
            }
        }

        //TODO: are all of the watches below necessary?
        $scope.$watch('addNewHeadCoach', function() {

            if ($scope.addNewHeadCoach) {

                $scope.users = data.users.getList();
            }
        });

        $scope.findSchoolsByName = function() {
            return schoolsFactory.query({name: $scope.schoolName, count: 10}).then(function(schools) {
                return $filter('orderBy')(schools, 'name');
            });
        };

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
            coach.addRole(newCoachRole);
            coach.save();
            $scope.team.roles = $scope.team.roles || [];
            $scope.team.roles.push(newCoachRole);
            $scope.addNewHeadCoach = false;
        };

        $scope.save = function(team) {

            data.teams.save(team).then(function() {
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
    '$rootScope', '$scope', '$state', '$filter', 'Teams.Data', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, $filter, data, schools) {

        $scope.teams = data.teams.getList();

        $scope.sports = data.sports.getList();
        $scope.indexedSports = data.sports.getCollection();

        $scope.leagues = data.leagues.getList();
        $scope.indexedLeagues = data.leagues.getCollection();

        $scope.add = function() {
            $state.go('team-info');
        };

        $scope.findSchoolsByName = function() {
            return schools.query({name: $scope.filter.schoolName, count: 10}).then(function(schools) {
                return $filter('orderBy')(schools, 'name');
            });
        };

        $scope.search = function(filter) {
            data.teams.query(filter,
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

