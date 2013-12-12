/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Schools page module.
 * @module Schools
 */
var Schools = angular.module('schools', [
    'ui.unique',
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Schools.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('school.html', require('./school.html'));
        $templateCache.put('schools.html', require('./schools.html'));
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
                views: {
                    'main@root': {
                        templateUrl: 'school.html',
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
    '$rootScope', '$scope', '$state', '$stateParams', 'SCHOOL_TYPES', 'SchoolsFactory', 'TeamsResource',
    function controller($rootScope, $scope, $state, $stateParams, SCHOOL_TYPES, schools, teams) {

        $scope.SCHOOL_TYPES = SCHOOL_TYPES;
        
        if ($stateParams.id) {

            schools.get($stateParams.id, function(school) {

                $scope.school = school;
                $scope.school.teams = teams.getList({ school: school.id});
            });
        }

        $scope.save = function(school) {

            schools.save(school);

            $state.go('schools');
        };

        $scope.cancel = function() {

            $state.go('schools');
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
    '$rootScope', '$scope', '$state', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, schools) {

        $scope.schools = schools.getList();

        $scope.add = function() {
            $state.go('school');
        };
        
        $scope.search = function(filter) {
            schools.getList(filter,
                function(schools){
                    $scope.schools = schools;
                    $scope.noResults = false;
                },
                function(){
                    $scope.schools = [];
                    $scope.noResults = true;
                }
            );
        };
    }
]);

