/* Fetch angular from the browser scope */
const angular = window.angular;
require('team-plan');
require('team-package');

/**
 * Teams page module.
 * @module Teams
 */
const Teams = angular.module('teams', [
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
                        '$q', '$stateParams', 'Teams.Data.Dependencies',
                        function($q, $stateParams, TeamData) {
                            let teamId = Number($stateParams.id);
                            let data = new TeamData(teamId);

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
                        '$stateParams', '$q', 'Teams.Data.Dependencies', 'TeamsFactory',
                        function($stateParams, $q, data, teams) {
                            let teamId = $stateParams.id;
                            if (teamId) {
                                data.breakdownStats = teams.getRemainingBreakdowns(teamId)
                                    .then(function(breakdownData) {
                                        return breakdownData;
                                    });
                            }

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

TeamDataDependencies.$inject = [
    'SportsFactory',
    'LeaguesFactory',
    'UsersFactory'
];

function TeamDataDependencies (
    sports,
    leagues,
    users
) {

    class TeamData {

        constructor (teamId) {

            /* Load data. */
            this.sports = sports.load();
            this.leagues = leagues.load();
            this.members = {};

            this.users = users.load({teamId: teamId})
            .then(users => {

                users.forEach(user => {

                    this.members[user.id] = user;
                });
            });
        }
    }

    return TeamData;
}

Teams.service('Teams.Data.Dependencies', TeamDataDependencies);

Teams.filter('visiblePlanOrPackage', [
    'NewDate',
    function(newDate) {

        return function visiblePlanOrPackageFilter(planOrPackageArray) {

            var currentDate = newDate.generateNow();
            var teamPackageOrPlan;

            planOrPackageArray = planOrPackageArray || [];
            var filteredItems = [];

            for (var i = 0; i < planOrPackageArray.length; i++) {
                var planOrPackage = planOrPackageArray[i];

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
Teams.controller('TeamPlansController', TeamPlansController);

TeamPlansController.$inject = [
    'Teams.Data',
    '$scope',
    '$filter',
    '$modal',
    'TeamsFactory',
    'TURNAROUND_TIME_MIN_TIME_LOOKUP',
    'BasicModals'
];

function TeamPlansController (
    data,
    $scope,
    $filter,
    $modal,
    teams,
    minTurnaroundTimeLookup,
    basicModals
) {

    //todo do we need to add a factory for remaining breakdowns so we dont need to inject data?
    $scope.breakdownStats = data.breakdownStats ? data.breakdownStats : {};
    $scope.isSavingPlan = false;
    $scope.isSavingPackage = false;
    $scope.minTurnaroundTimeLookup = minTurnaroundTimeLookup;

    $scope.team.teamPackages = $scope.team.teamPackages || [];
    $scope.team.teamPlans = $scope.team.teamPlans || [];

    $scope.applyFilter = function() {
        $scope.filteredPackages = $filter('visiblePlanOrPackage')($scope.team.teamPackages);
        $scope.filteredPlans = $filter('visiblePlanOrPackage')($scope.team.teamPlans);
    };

    $scope.$watch(function() { return $scope.team.teamPlans; }, $scope.applyFilter, true);
    $scope.$watch(function() { return $scope.team.teamPackages; }, $scope.applyFilter, true);

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
            $scope.isSavingPackage = true;
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
            $scope.isSavingPlan = true;
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
            $scope.isSavingPackage = true;
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
            $scope.isSavingPlan = true;
            $scope.save($scope.team);
        });
    };

    //todo I really dislike this code
    $scope.save = function(team) {
        teams.save(team).then(function() {
            teams.getRemainingBreakdowns(team.id)
                .then(function(breakdownData) {
                    $scope.isSavingPlan = false;
                    $scope.isSavingPackage = false;
                    $scope.breakdownStats = breakdownData;
                });
        });
    };
}

/**
 * Team controller. Controls the view for adding and editing a single team.
 * @module Teams
 * @name TeamController
 * @type {Controller}
 */
Teams.controller('TeamController', TeamController);

TeamController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$filter',
    '$modal',
    'ROLES',
    'Teams.Data',
    'SportsFactory',
    'LeaguesFactory',
    'SchoolsFactory',
    'TeamsFactory',
    'PRIORITIES',
    'UsersFactory',
    'EMAILS'
];

function TeamController (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $filter,
    $modal,
    ROLES,
    data,
    sports,
    leagues,
    schoolsFactory,
    teams,
    PRIORITIES,
    users,
    EMAILS
) {

    $scope.PRIORITIES = PRIORITIES;
    $scope.ROLES = ROLES;
    $scope.HEAD_COACH = ROLES.HEAD_COACH;

    $scope.sports = sports.getList();
    $scope.indexedSports = sports.getCollection();

    $scope.leagues = leagues.getList();
    $scope.indexedLeagues = leagues.getCollection();

    $scope.EMAILS = EMAILS;

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
        $scope.team = teams.create();
        var teamId = $stateParams.id;

        if (teamId) {
            teams.fetch(teamId).then(team => {

                angular.extend($scope.team, team);
                $scope.team.members = data.members;
                $scope.sportId = leagues.get(team.leagueId).sportId;
                $scope.updateTeamAddress();
            });
        }
    }

    //TODO: are all of the watches below necessary?
    $scope.$watch('addNewHeadCoach', function() {

        if ($scope.addNewHeadCoach) {

            $scope.users = users.getList();
        }
    });

    $scope.findSchoolsByName = function() {
        return schoolsFactory.query({name: $scope.schoolName}).then(function(schools) {
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
        coach.addRole(newCoachRole, $scope.team);
        coach.save();
        $scope.team.roles = $scope.team.roles || [];
        $scope.team.roles.push(newCoachRole);
        $scope.addNewHeadCoach = false;
    };

}

/**
 * Teams controller. Controls the view for displaying multiple teams.
 * @module Teams
 * @name TeamsController
 * @type {Controller}
 */
Teams.controller('TeamsController', TeamsController);

TeamsController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$q',
    '$filter',
    'SportsFactory',
    'LeaguesFactory',
    'SchoolsFactory',
    'TeamsFactory',
    'Teams.Data'
];

function TeamsController (
    $rootScope,
    $scope,
    $state,
    $q,
    $filter,
    sports,
    leagues,
    schools,
    teams,
    data
) {

    $scope.teams = [];

    //TODO potential candiate for changing filter to true instead of 1 if the backend begins to support it
    $scope.filter = {
        isCustomerTeam: 1
    };

    $scope.sports = sports.getList();
    $scope.indexedSports = sports.getCollection();
    $scope.schools = schools.getCollection();
    $scope.leagues = leagues.getList();
    $scope.indexedLeagues = leagues.getCollection();

    $scope.add = function() {
        $state.go('team-info');
    };

    $scope.findSchoolsByName = function() {
        return schools.query({name: $scope.filter.schoolName, count: 10}).then(function(schools) {
            return $filter('orderBy')(schools, 'name');
        });
    };

    $scope.search = function(query) {

        $scope.searching = true;
        $scope.teams.length = 0;

        $scope.query = teams.search(query).then(function(teams) {

            $scope.teams = teams;

        }).finally(function() {

            $scope.searching = false;
        });
    };
}
