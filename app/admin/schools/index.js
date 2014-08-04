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
                },
                resolve: {
                    'Schools.Data': [
                        '$q', 'Schools.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
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
                        '$q', 'Schools.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
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
                },
                resolve: {
                    'Schools.Data': [
                        '$q', 'Schools.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);

Schools.service('Schools.Data.Dependencies', [
    'TeamsFactory',
    function(teams) {

        var Data = {};

        angular.forEach(arguments, function(arg) {
            Data[arg.description] = arg.load();
        });

        return Data;

    }
]);

/**
 * School controller. Controls the view for adding and editing a single school.
 * @module School
 * @name SchoolController
 * @type {Controller}
 */
Schools.controller('SchoolController', [
    '$rootScope', '$scope', '$state', '$stateParams', 'SCHOOL_TYPES', 'Schools.Data', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, $stateParams, SCHOOL_TYPES, data, schools) {

        $scope.SCHOOL_TYPES = SCHOOL_TYPES;

        $scope.school = $scope.school || {};
        $scope.teams = $scope.teams || [];

        if ($stateParams.id) {
            schools.fetch($stateParams.id).then(function(school) {
                $scope.school = school;
            });

            data.teams.query({ school: $scope.school.id}).then(function(queriedTeams) {
                $scope.teams = queriedTeams;
            });
        }

        $scope.save = function(school) {
            schools.save(school).then(function() {
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
    '$rootScope', '$scope', '$state', 'Schools.Data', 'SchoolsFactory',
    function controller($rootScope, $scope, $state, data, schools) {

        $scope.schools = [];

        $scope.add = function() {
            $state.go('school-info');
        };

        $scope.search = function(filter) {
            schools.query(filter,
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

