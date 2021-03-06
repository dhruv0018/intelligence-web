/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

import TeamPackage from './team-package';
import TeamPlan from './team-plan';

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
                        templateUrl: 'app/admin/teams/teams.html',
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
                        templateUrl: 'app/admin/teams/team.html',
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
                        templateUrl: 'app/admin/teams/team-info.html',
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
                        templateUrl: 'app/admin/teams/team-plans.html',
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
                        templateUrl: 'app/admin/teams/team-members.html',
                        controller: 'TeamController'
                    }
                }
            })

            .state('team-conferences', {
                url: '',
                parent: 'team',
                views: {
                    'content@team': {
                        templateUrl: 'app/admin/teams/team-conferences.html',
                        controller: 'TeamConferencesController'
                    }
                },
                resolve: {
                    'Conference.Data': [
                        '$stateParams',
                        '$q',
                        'SportsFactory',
                        'TeamsFactory',
                        'AssociationsFactory',
                        function(
                            $stateParams,
                            $q,
                            sports,
                            teams,
                            associations
                        ) {
                            let teamId = $stateParams.id;
                            //let data = new ConferenceData(teamId);
                            let data = {
                                sports: sports.getMap(),
                                associations: associations.load()
                            };

                            data.availableConferences = teams.getAvailableConferences(teamId).then(conferences => {
                                return conferences.map(conference => {
                                    conference.fullName = conference.conference.name + ' ( ' + conference.sportsAssociation + ' )';
                                    conference.conferenceObj = conference.conference;
                                    conference.conference = conference.conference.code;
                                    return conference;
                                });
                            });
                            data.teamConferences = teams.getConferences(teamId).then(conferences => {
                                return conferences.map(conference => {
                                    conference.fullName = conference.conference.name + ' ( ' + conference.sportsAssociation + ' )';
                                    conference.conferenceObj = conference.conference;
                                    conference.conference = conference.conference.code;
                                    return conference;
                                });
                            });

                            return $q.all(data);
                        }
                    ]
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
    '$uibModal',
    'TeamsFactory',
    'TURNAROUND_TIME_MIN_TIME_LOOKUP',
    'BasicModals',
    'NewDate'
];

function TeamPlansController (
    data,
    $scope,
    $filter,
    $uibModal,
    teams,
    minTurnaroundTimeLookup,
    basicModals,
    newDate
) {

    //todo do we need to add a factory for remaining breakdowns so we dont need to inject data?
    $scope.showCurrent = true;
    $scope.breakdownStats = data.breakdownStats ? data.breakdownStats : {};
    $scope.isSavingPlan = false;
    $scope.isSavingPackage = false;
    $scope.minTurnaroundTimeLookup = minTurnaroundTimeLookup;

    $scope.team.teamPackages = $scope.team.teamPackages || [];
    $scope.team.teamPackages.forEach(teamPackage => {
        if (typeof teamPackage.endDate === 'string') {
            teamPackage.endDate = newDate.generatePackageEndDate(teamPackage.endDate);
            teamPackage.startDate = newDate.generatePackageStartDate(teamPackage.startDate);
        }
    });
    $scope.team.teamPlans = $scope.team.teamPlans || [];
    $scope.team.teamPlans.forEach(teamPlan => {
        if (typeof teamPlan.endDate === 'string') {
            teamPlan.endDate = newDate.generatePlanEndDate(teamPlan.endDate);
            teamPlan.startDate = newDate.generatePlanStartDate(teamPlan.startDate);
        }
    });

    $scope.applyFilter = function() {
        $scope.filteredPackages = $filter('visiblePlanOrPackage')($scope.team.teamPackages);
        $scope.filteredPlans = $filter('visiblePlanOrPackage')($scope.team.teamPlans);
    };

    $scope.$watch(function() { return $scope.team.teamPlans; }, $scope.applyFilter, true);
    $scope.$watch(function() { return $scope.team.teamPackages; }, $scope.applyFilter, true);

    var openPackageModal = function(editTeamPackageObjIndex) {
        var modalInstance = $uibModal.open({
            scope: $scope,
            size: 'sm',
            templateUrl: 'app/admin/teams/team-package/template.html',
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
        var modalInstance = $uibModal.open({
            templateUrl: 'app/admin/teams/team-plan/template.html',
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
            $scope.isSavingPackage = true;
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
            $scope.isSavingPlan = true;
            $scope.team.teamPlans.splice(planIdToRemove, 1);
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
    '$uibModal',
    'ROLES',
    'Teams.Data',
    'SportsFactory',
    'LeaguesFactory',
    'SchoolsFactory',
    'TeamsFactory',
    'PRIORITIES',
    'PRIORITIES_IDS',
    'UsersFactory',
    'EMAILS',
    'TEAM_GENDERS',
    'TEAM_TYPES',
    'TEAM_AGE_LEVELS',
    'TEAM_AMATEURPROS',
    'SPORTS',
    'SPORT_IDS',
    'LABELS'
];

function TeamController (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $filter,
    $uibModal,
    ROLES,
    data,
    sports,
    leagues,
    schoolsFactory,
    teams,
    PRIORITIES,
    PRIORITIES_IDS,
    users,
    EMAILS,
    TEAM_GENDERS,
    TEAM_TYPES,
    TEAM_AGE_LEVELS,
    TEAM_AMATEURPROS,
    SPORTS,
    SPORT_IDS,
    LABELS
) {

    $scope.PRIORITIES = PRIORITIES;
    $scope.PRIORITIES_IDS = PRIORITIES_IDS;
    $scope.ROLES = ROLES;
    $scope.HEAD_COACH = ROLES.HEAD_COACH;

    $scope.sports = sports.getList();
    $scope.indexedSports = sports.getCollection();

    $scope.leagues = leagues.getList();
    $scope.indexedLeagues = leagues.getCollection();

    $scope.EMAILS = EMAILS;

    var team;
    $scope.schoolName = '';
    $scope.rolesChanged = false;

    $scope.genders = Object.keys(TEAM_GENDERS).map(key => TEAM_GENDERS[key]);
    $scope.types = Object.keys(TEAM_TYPES).map(key => TEAM_TYPES[key]);
    $scope.ageLevels = Object.keys(TEAM_AGE_LEVELS).map(key => TEAM_AGE_LEVELS[key]);
    $scope.amateurPros = Object.keys(TEAM_AMATEURPROS).map(key => TEAM_AMATEURPROS[key]);
    $scope.labelOptions = Object.keys(LABELS).map(key => LABELS[key]);
    $scope.priorityOptions = Object.keys(PRIORITIES).map(key => PRIORITIES[key]);

    $scope.$watch('team.isCanonical', function(n, o){
        if(n !== o && o !== undefined){
            $scope.form.$setDirty();
        }
    });

    $scope.getLabel = function(id){
        if(!id){
            return 'Select label';
        }
        let selectedLabel = $scope.labelOptions.find(
            label =>{
                return label.id === id;
            }
        );
        return selectedLabel ? selectedLabel.abbreviation + ' '+ selectedLabel.name : 'Select label';
    };

    $scope.changeMenu = function(){
        $scope.form.$setDirty();
    };

    $scope.$watch('team.leagueId', function(nVal, oVal){
        if(nVal && typeof nVal =='number'){
            let curLeague = leagues.get(nVal);
            $scope.team.gender = curLeague.gender.substr(0,1).toUpperCase()+curLeague.gender.substr(1);
        }
    });

    $scope.$watch('team.sportId', function(nVal, oVal){
        if(nVal && oVal && nVal !== oVal){
            $scope.team.leagueId = null;
            $scope.team.gender = null;
        }
    });

    $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
    };

    $scope.removeRole = (role) => {
        role.tenureEnd = new Date();
        $scope.rolesChanged = true;
    };

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
        $scope.team = teams.create({type: '', ageLevel: '', amateurPro: ''});
        var teamId = $stateParams.id;

        if (teamId) {
            teams.fetch(teamId).then(team => {
                angular.extend($scope.team, team);
                $scope.team.members = data.members;
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

    $scope.preSave = null;
    $scope.addHeadCoach = function(coach) {

        var newCoachRole = ROLES.HEAD_COACH;
        newCoachRole.userId = coach.id;
        newCoachRole.teamId = $scope.team.id;
        coach.addRole(newCoachRole, $scope.team);
        coach.activateRole(newCoachRole);
        $scope.team.roles = $scope.team.roles || [];
        $scope.team.roles.push(newCoachRole);
        $scope.rolesChanged = true;
        $scope.addNewHeadCoach = false;
        $scope.team.members[coach.id] = coach;
        $scope.preSave = () => $scope.saveCoach(coach);
    };

    $scope.saveCoach = (coach) => {
        return coach.save();
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
    '$stateParams',
    '$q',
    '$filter',
    'SportsFactory',
    'LeaguesFactory',
    'SchoolsFactory',
    'TeamsFactory',
    'Teams.Data',
    'AdminSearchService'
];

function TeamsController (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $q,
    $filter,
    sports,
    leagues,
    schools,
    teams,
    data,
    searchService
) {
    const TEAMSPERPAGE = 30; //max number of teams shown per page

    $scope.teams = [];

    $scope.filter = searchService.teams.filter;

    $scope.sports = sports.getList();
    $scope.indexedSports = sports.getCollection();
    $scope.schools = schools.getCollection();
    $scope.leagues = leagues.getList();
    $scope.indexedLeagues = leagues.getCollection();
    $scope.page = {};
    $scope.page.currentPage = $stateParams.page || 1;
    $scope.totalCount = data.count;
    $scope.itemPerPage = TEAMSPERPAGE;

    $scope.add = function() {
        $state.go('team-info');
    };

    $scope.findSchoolsByName = function() {
        let params = {};
        params["name"] = $scope.filter.schoolName;
        params["count"] = 50;

        if($scope.filter.leagueId) {
            params["leagueId"] = $scope.filter.leagueId;
        }

        if($scope.filter.sportId) {
            params["sportId"] = $scope.filter.sportId;
        }

        return schools.query(params).then(function(schools) {
            return $filter('orderBy')(schools, 'name');
        });
    };

    $scope.schoolSelected = function(item){
        $scope.filter.city = item.address.city;
        $scope.filter.region = item.address.regionCode;
    };

    function setSearchResults(teams, count) {
        let deferred = $q.defer();
        $scope.query = deferred.promise;

        let schoolIds = [];
        teams.forEach(function (team) {
            if (team.schoolId) {
                schoolIds.push(team.schoolId);
            }
        });

        function setResults() {
            if (count) {
                $scope.totalCount = count;
            }

            $scope.teams = teams;
            $scope.searching = false;
        }

        if (schoolIds.length) {
            schools.load(schoolIds).then(function() {
                setResults();
                deferred.resolve();
            });
        }
        else {
            setResults();
            deferred.resolve();
        }
    }

    $scope.search = function(query) {

        let params = angular.copy(query);
        $scope.searching = true;
        $scope.teams.length = 0;


        if(params.id) {
            let deferred = $q.defer();
            $scope.query = deferred.promise;

            teams.load(params.id)
            .then(function(){
                $state.go('team-info', { id: params.id });
            })
            .finally(function(){
                $scope.teams = [];
                $scope.searching = false;
                deferred.resolve();
            });
        }
        else {
            if(params.isCanonical) {
                params.isCanonical = 1;
            }
            else {
                delete params.isCanonical;
            }

            query.count = TEAMSPERPAGE;
            $scope.page.currentPage = 1;

            $scope.query = teams.getTeamsList(params).then(function(teamData) {
                setSearchResults(teamData.data, teamData.count);
            });
        }

    };

    $scope.clearSearchFilter = function() {
        searchService.teams.clear();
        $scope.filter = searchService.teams.filter;
        $scope.teams = [];
    };

    // Restore the state of the previous search from the service
    // Checking for length > 1 since one property is set by default in searchService
    if (Object.keys($scope.filter).length > 1 && !$scope.filter.id) {
        $scope.search($scope.filter);
    }

    $scope.pageChanged = function () {
        document.getElementById('team-data').scrollTop = 0;

        let filter = angular.copy($scope.filter);
        filter.page = $scope.page.currentPage;

        if(filter.isCanonical) {
            filter.isCanonical = 1;
        }
        else {
            delete filter.isCanonical;
        }

        $scope.searching = true;
        $scope.teams.length = 0;

        $scope.query = teams.getTeamsList(filter, false).then(function(teams) {
            setSearchResults(teams.data, teams.count);
        });
    };

    $scope.schoolKeyPressTracker = function(keyEvent, name) {
        var input = document.getElementById('search-team-school-name-cta');
        var list = input.parentElement.getElementsByTagName('li');
        var currentEl = input.parentElement.querySelector('li.active');
        var currentIdx = Array.prototype.indexOf.call(list, currentEl);

        if (list.length && list[currentIdx]) {
            let listHeightThreshold = list[0].parentNode.clientHeight - (list[0].clientHeight * 2);
            // Down arrow key
            if (keyEvent.keyCode === 40) {
                if (currentIdx === list.length - 1) {
                    // Down arrow pressed and it was on the last item.  Scrolling to top of list
                    list[0].parentNode.scrollTop = 0;
                }
                else if ((list[0].parentNode.scrollTop + listHeightThreshold) < list[currentIdx].offsetTop) {
                    // Item is out of view, need to scroll to it
                    list[currentIdx].parentNode.scrollTop = list[currentIdx].offsetTop;
                }
            }
            else if(keyEvent.keyCode === 38) {
                // press arrow up key and the highlighted item would be out of view
                if (currentIdx === 0) {
                    // Up arrow pressed and it was on the first item.  Scrolling to last item
                    list[0].parentNode.scrollTop = list[list.length - 1].offsetTop;
                }
                else if (list[0].parentNode.scrollTop >= (list[currentIdx].offsetTop - list[currentIdx].clientHeight)) {
                    // Item is out of view, need to scroll to it
                    list[currentIdx].parentNode.scrollTop = list[0].parentNode.scrollTop - list[currentIdx].clientHeight >= 0
                    ? list[0].parentNode.scrollTop - listHeightThreshold
                    : 0;
                }
            }
        }
    };
}

/**
 * Teams controller. Controls the view for displaying multiple teams.
 * @module Teams
 * @name TeamConferencesController
 * @type {Controller}
 */
Teams.controller('TeamConferencesController', TeamConferencesController);

TeamConferencesController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'TeamsFactory',
    'AssociationsFactory',
    'Conference.Data',
    '$q',
    'BasicModals',
    'AlertsService',
    '$timeout'
];

function TeamConferencesController(
    $scope,
    $state,
    $stateParams,
    teams,
    associations,
    ConferenceData,
    $q,
    basicModals,
    alerts,
    $timeout
){

    let teamId = $stateParams.id;
    let deleteItems = [];
    let primaryConferenceSet = false;

    $scope.addConferenceDisabled = true;
    $scope.isSaving = false;

    $scope.availableConferences = [];
    $scope.teamConferences = ConferenceData.teamConferences.sort((a, b) => moment(b.createdAt).diff(a.createdAt));

    //In the future the backend will take out the exisitng items, this may not be needed
    angular.forEach(ConferenceData.availableConferences, function(item, idx){
        let existIdx;
        angular.forEach($scope.teamConferences, function(teamConference){
            if(teamConference.fullName == item.fullName){
                existIdx = idx;
            }
        });

        if(typeof existIdx !== 'number'){
            $scope.availableConferences.push(item);
        }
    });

    angular.forEach($scope.teamConferences, function(item){
        associations.loadCompetitionLevels(item.sportsAssociation).then(function(response){
            item.lstCompetitionLevels = response;
            angular.forEach(item.lstCompetitionLevels, function(level){
                //add default, need to find correct attribute name for item.confernce.code
                if(item.conferenceObj.competitionLevel == level.code){
                    item.nullName = level.name + ' (Conference Default)';
                }
            });
            if(!item.conferenceObj.competitionLevel){
                item.nullName = 'None';
            }
        });
        if(item.isPrimary=== 'Y'){
            primaryConferenceSet = true;
        }
        item.selectBoxInit = false;
    });

    function checkDuplicate(sportsAssociation){
        let result = false;
        angular.forEach($scope.teamConferences, function(tConference){
            if(tConference.sportsAssociation == sportsAssociation){
                result = true;
            }
        });

        return result;
    }

    $scope.changeLevel = function(item){
        if(!item.competitionLevel && !item.selectBoxInit && item.id){
            $scope.form.$setPristine();
            item.selectBoxInit = true;
        }
    };

    $scope.selConference = function(seletedConference){
        $scope.newConference = seletedConference;
        $scope.addConferenceDisabled = false;
        $scope.form.$setDirty();
    };

    $scope.addConference = function(newConference){
        let idx = $scope.availableConferences.indexOf(newConference);
        if(checkDuplicate(newConference.sportsAssociation)){
            let alertModal = basicModals.openForAlert({
                title: 'Action not allowed',
                bodyText: 'A team cannot be a member of more than one conference from the same association.',
                buttonText: 'OK'
            });
        }else{
            newConference.teamId = teamId;
            newConference.id = null;
            newConference.isPrimary = null;
            newConference.competitionLevel = null;
            newConference.lstCompetitionLevels = associations.loadCompetitionLevels(newConference.sportsAssociation).then(function(response){
                newConference.lstCompetitionLevels = response;
                angular.forEach(newConference.lstCompetitionLevels, function(level){
                    //add default, need to find correct attribute name for item.confernce.code
                    if(newConference.conferenceObj.competitionLevel == level.code){
                        newConference.nullName = level.name + ' (Conference Default)';
                    }
                });
                if(!newConference.conferenceObj.competitionLevel){
                    newConference.nullName = 'None';
                }
            });
            newConference.conference = newConference.conferenceObj.code;
            $scope.teamConferences.push(newConference);
            $scope.availableConferences.splice(idx, 1);
            $scope.addConferenceDisabled = true;
            $scope.newConference = null;
        }
    };

    $scope.removeConference = function(idx){
        let curConference = $scope.teamConferences.splice(idx, 1);
        let curConferenceId= curConference[0].id;
        if(curConference[0].isPrimary == 'Y'){
            primaryConferenceSet = false;
        }
        $scope.form.$setDirty();
        if(curConference){
            $scope.availableConferences.push(curConference[0]);
        }
        if(curConferenceId){
            deleteItems.push(curConferenceId);
        }
    };

    $scope.selPrimaryConference = function(idx){
        $scope.form.$setDirty();
        angular.forEach($scope.teamConferences, function(teamConference, i){
            teamConference.isPrimary = (idx === i) ? 'Y' : null;
        });
        primaryConferenceSet = true;
    };

    $scope.cancel = function(){
        $state.transitionTo($state.current, $stateParams, {
            reload: true
        });
    };

    $scope.saveAll = function(){
        //delete items
        $scope.isSaving = true;
        let promises = [];
        //check if one primary conference is set
        if(primaryConferenceSet === false && $scope.teamConferences.length >0){
            $scope.isSaving = false;
            //set alert message
            let alertModal = basicModals.openForAlert({
                title: 'Missing Primary Conference',
                bodyText: 'Your changes could not be saved. One conference must be marked as the primary conference.',
                buttonText: 'OK'
            });
            return false;
        }


        if(deleteItems.length > 0){
            angular.forEach(deleteItems, function(conferenceId){
                let delPromise = teams.deleteConference(teamId, conferenceId);
                promises.push(delPromise.$promise);
            });
        }

        angular.forEach($scope.teamConferences, function(teamConference, i){
            if(!teamConference.id){
                //need to add data
                if(!teamConference.competitionLevel || teamConference.competitionLevel == 'null'){
                    teamConference.competitionLevel = null;
                }
                let addPromise = teams.addConference(teamId, teamConference).then(function(response){
                    teamConference.id = response.id;
                    teamConference.conference = teamConference.conferenceObj;
                });
                promises.push(addPromise.$promise);
            }else{
                //update data
                if(!teamConference.competitionLevel || teamConference.competitionLevel == 'null'){
                    teamConference.competitionLevel = null;
                }
                let updatePromise = teams.updateConference(teamId, teamConference);
                promises.push(updatePromise.$promise);
            }
        });

        $q.all(promises).then(function(response){
            $scope.isSaving = false;
            $scope.form.$setPristine();
            alerts.add({
                type: 'success',
                message: 'Changes Saved!'
            });
        }).catch(function(response){
            $scope.isSaving = false;
            throw new Error('The changes can not be saved.');
        }).finally(function(){

        });
    };

}

export default Teams;
