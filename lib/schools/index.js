/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Schools page module.
 * @module Schools
 */
var Schools = angular.module('schools', [
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
                views: {
                    'header': {
                        templateUrl: 'header.html',
                        controller: 'HeaderController'
                    },
                    'main': {
                        templateUrl: 'schools.html',
                        controller: 'SchoolsController'
                    }
                }
            })

            .state('school', {
                url: '/schools',
                views: {
                    'header': {
                        templateUrl: 'header.html',
                        controller: 'HeaderController'
                    },
                    'main': {
                        templateUrl: 'school.html',
                        controller: 'SchoolController'
                    }
                }
            });
    }
]);

/**
 * Schools value. Holds data for the current school..
 * @module Schools
 * @name School
 * @type {Value}
 */
Schools.value('School', {

    data: null,

    set: function(school) {
        this.data = school;
    }
});

/**
 * School controller. Controls the view for adding and editing a single school.
 * @module School
 * @name SchoolController
 * @type {Controller}
 */
Schools.controller('SchoolController', [
    '$rootScope', '$scope', '$state', 'School', 'SchoolsFactory', 'TeamsResource',
    function controller($rootScope, $scope, $state, school, schools, teams) {

        $scope.school = school.data || { name: 'New School' };

        $scope.school.teams = [];

        teams.query(function(teamsList) {

            for (var i = 0; i < teamsList.length; i++) {

                if ($scope.school.id === teamsList[i].schoolId) {

                    $scope.school.teams.push(teamsList[i]);
                }
            }
        });

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
    '$rootScope', '$scope', '$state', 'School', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, school, schools) {

        $scope.schools = schools.getList();

        $scope.add = function() {

            school.set(null);
            $state.go('school');
        };

        $scope.edit = function(data) {

            school.set(data);
            $state.go('school');
        };
    }
]);

