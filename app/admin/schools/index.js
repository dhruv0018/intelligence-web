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
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', 'SCHOOL_TYPES', 'SchoolsFactory', 'TeamsFactory',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, SCHOOL_TYPES, schools, teams) {

        $scope.SCHOOL_TYPES = SCHOOL_TYPES;

        $scope.$storage = $localStorage;

        /* Get the school from storage. */
        var school = $scope.$storage.school;

        /* If no school is stored locally, then get the school from the server. */
        if (!school) {

            /* Get the school ID from the state parameters. */
            var schoolId = $stateParams.id;

            /* Make sure there is a school ID before contacting the server. */
            if (schoolId) {

                /* Get the school by ID from the server if given. */
                schools.get(schoolId, function(school) {

                    /* Store the school locally. */
                    $scope.$storage.school = school;

                    $scope.teams = teams.getList({ school: school.id});
                });
            }
        }

        $scope.save = function(school) {

            schools.save(school).then(function() {
                delete $scope.$storage.school;
                $state.go('schools');
            });
        };
    }
]);

/**
 * Schools controller. Controls the view for displaying multiple schools.
 * @module Schools
 * @name SchoolsController
 * @type {Controller}
 */
Schools.controller('SchoolsController', [
    '$rootScope', '$scope', '$state', '$localStorage', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, $localStorage, schools) {

        $scope.schools = schools.getList();

        $scope.add = function() {

            delete $localStorage.school;
            $state.go('school-info');
        };

        $scope.search = function(filter) {
            schools.getList(filter,
                function(schools) {
                    $scope.schools = schools;
                    $scope.noResults = false;
                },
                function() {
                    $scope.schools = [];
                    $scope.noResults = true;
                }
            );
        };
    }
]);

