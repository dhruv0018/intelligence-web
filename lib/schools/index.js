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
    '$rootScope', '$scope', '$state', 'School', 'Schools',
    function controller($rootScope, $scope, $state, school, schools) {

        $scope.school = school.data;

        $scope.save = function(school) {

            schools.save(school);
        };

        $scope.cancel = function() {

            $state.transitionTo('schools');
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
    '$rootScope', '$scope', '$state', 'School', 'Schools',
    function controller($rootScope, $scope, $state, school, schools) {

        $scope.schools = schools.get();

        $scope.add = function() {

            school.set(null);
            $state.transitionTo('school');
        };

        $scope.edit = function(data) {

            school.set(data);
            $state.transitionTo('school');
        };
    }
]);

