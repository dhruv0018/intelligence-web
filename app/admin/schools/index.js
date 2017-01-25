const angular = window.angular;

/**
 * Schools page module.
 * @module Schools
 */
const Schools = angular.module('schools', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/**
 * Schools page state router.
 * @module Schools
 * @type {UI-Router}
 */
Schools.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('schools', {
                url: '/schools',
                parent: 'base',
                views: {
                    'main@root': {
                        templateUrl: 'app/admin/schools/schools.html',
                        controller: 'SchoolsController'
                    }
                }
            })

            .state('school', {
                url: '/school/:id',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'app/admin/schools/school/school.html',
                        controller: 'SchoolController'
                    }
                },
                resolve: {
                    'Schools.Data': [
                        '$stateParams', '$q', 'SchoolsFactory', 'TeamsFactory',
                        function($stateParams, $q, schools, teams) {

                            var schoolId = Number($stateParams.id);

                            var Data = {};

                            if (schoolId) {

                                Data.school = schools.load(schoolId);
                                Data.teams = teams.load({ schoolId: schoolId });
                            }

                            return $q.all(Data);
                        }
                    ]
                }
            })

            .state('school-info', {
                url: '',
                parent: 'school',
                views: {
                    'content@school': {
                        templateUrl: 'app/admin/schools/school/school-info.html',
                        controller: 'SchoolController'
                    }
                }
            });
    }
]);

/**
 * School controller. Controls the view for adding and editing a single school.
 * @module School
 * @name SchoolController
 * @type {Controller}
 */
Schools.controller('SchoolController', [
    '$rootScope', '$scope', '$state', '$stateParams', 'SCHOOL_TYPES', 'SchoolsFactory', 'TeamsFactory', 'LeaguesFactory',
    function controller($rootScope, $scope, $state, $stateParams, SCHOOL_TYPES, schools, teams, leagues) {

        $scope.SCHOOL_TYPES = SCHOOL_TYPES;

        var schoolId = Number($stateParams.id);

        if (schoolId) {

            $scope.school = schools.get(schoolId);
            $scope.teams = teams.getList({ schoolId: schoolId });
        }

        $scope.school = $scope.school || schools.create();
        $scope.teams = $scope.teams || [];

        $scope.leagues = leagues;

        const teamLeagues = new Map($scope.teams.map(team => [team.id, leagues.get(team.leagueId)]));
        $scope.teamLeagues = teamLeagues;
    }
]);

/**
 * Schools controller. Controls the view for displaying multiple schools.
 * @module Schools
 * @name SchoolsController
 * @type {Controller}
 */
Schools.controller('SchoolsController', [
    '$rootScope',
    '$scope',
    '$state',
    '$q',
    'SchoolsFactory',
    'AdminSearchService',
    '$stateParams',
    function controller(
        $rootScope,
        $scope,
        $state,
        $q,
        schools,
        searchService,
        $stateParams
    ) {

        const ITEMSPERPAGE = 30;
        $scope.schools = [];
        $scope.filter = searchService.schools.filter;
        $scope.itemPerPage = ITEMSPERPAGE;
        $scope.page = {};
        $scope.page.currentPage = $stateParams.page || 1;

        $scope.add = function() {
            $state.go('school-info');
        };

        $scope.search = function(filter) {

            $scope.searching = true;
            $scope.schools.length = 0;

            if (filter.id) {
                let deferred = $q.defer();
                $state.query = deferred.promise;

                schools.load(filter.id)
                .then(function() {
                    $state.go('school-info', { id: filter.id });
                })
                .finally(function() {
                    $scope.schools = [];
                    $scope.searching = false;
                    deferred.resolve();
                });
            }
            else {
                $scope.page.currentPage = 1;

                $scope.query = schools.getSchoolsList(filter).then(response => {
                    $scope.schools = response.data;
                    $scope.totalCount = response.count;

                }).finally(() =>{
                    $scope.searching = false;
                });
            }
        };

        $scope.clearSearchFilter = function() {
            searchService.schools.clear();
            $scope.filter = {};
            $scope.schools = [];
        };

        $scope.pageChanged = function(){
            delete $scope.filter.start;
            document.getElementById('school-data').scrollTop = 0;

            let filter = angular.copy($scope.filter);
            filter.page = $scope.page.currentPage;

            $scope.searching = true;
            $scope.schools.length = 0;

            $scope.query = schools.getSchoolsList(filter, false).then(response =>{
                $scope.schools = response.data;
            }).finally(()=>{
                $scope.searching = false;
            });
        };

        // Restore the state of the previous search from the service
        if (Object.keys($scope.filter).length && !$scope.filter.id) {
            $scope.search($scope.filter);
        }
    }
]);

export default Schools;
