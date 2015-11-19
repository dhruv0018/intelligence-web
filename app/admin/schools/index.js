/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Schools page module.
 * @module Schools
 */
var Schools = angular.module('schools', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/* Cache the template file */
Schools.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('school.html', require('./school.html'));
        $templateCache.put('schools.html', require('./schools.html'));
        $templateCache.put('school-info.html', require('./school-info.html'));
    }
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
                        templateUrl: 'schools.html',
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
                        templateUrl: 'school.html',
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
                        templateUrl: 'school-info.html',
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
    '$rootScope', '$scope', '$state', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, schools) {

        $scope.schools = [];

        $scope.add = function() {
            $state.go('school-info');
        };

        $scope.search = function(filter) {

            $scope.searching = true;
            $scope.schools.length = 0;

            $scope.query = schools.query(filter).then(function(schools) {

                $scope.schools = schools;

            }).finally(function() {

                $scope.searching = false;
            });
        };
    }
]);
