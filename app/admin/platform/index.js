require('leagues');
require('new-plan');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Platform module.
 * @module Platform
 */
var Platform = angular.module('platform', [
    'ui.router',
    'ui.bootstrap',
    'leagues',
    'new-plan'
]);

/* Cache the template file */
Platform.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('platform.html', require('./platform.html'));
        $templateCache.put('plan-defaults.html', require('./plan-defaults.html'));
    }
]);

/**
 * Platform state router.
 * @module Platform
 * @type {UI-Router}
 */
Platform.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('platform', {
                url: '/platform',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'platform.html',
                        controller: 'PlatformController'
                    }
                },
                resolve: {
                    'Platform.Data': [
                        '$q', 'Platform.Data.Dependencies',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
                }
            })

            .state('plan-defaults', {
                url: '',
                parent: 'platform',
                views: {
                    'content@platform': {
                        templateUrl: 'plan-defaults.html'
                    }
                }
            });
    }
]);

Platform.service('Platform.Data.Dependencies', [
    'SportsFactory', 'LeaguesFactory', 'PlansFactory',
    function dataService(sports, leagues, plans) {

        var Data = {};

        angular.forEach(arguments, function(arg) {
            Data[arg.description] = arg.load();
        });

        return Data;

    }
]);

Platform.filter('monthFilter', function() {
    return function(monthNumber) {
        return moment(moment().month(moment(monthNumber))).format('MMM');
    };
});

Platform.filter('filterDefaultPlans', function() {
    return function(plans, sportId) {
        if (!plans) return plans;

        var returnArray = [];
        for (var i = 0; i < plans.length; i++) {
            if (!sportId || plans[i].sportId === sportId) {
                returnArray.push(plans[i]);
            }
        }
        return returnArray;
    };
});

Platform.controller('PlatformController', [
    '$scope', '$modal', 'TURNAROUND_TIME_MIN_TIME_LOOKUP', 'Platform.Data', 'SportsFactory', 'LeaguesFactory', 'PlansFactory',
    function controller($scope, $modal, turnaroundTimeMinTimeLookup, data, sports, leagues, plans) {

        $scope.leagues = leagues.getList();
        $scope.indexedLeagues = leagues.getCollection();
        $scope.plans = plans.getList();
        $scope.sports = sports.getList();

        //TODO: plan should have sportId
        angular.forEach($scope.plans, function(plan) {
            plan.sportId = leagues.get(plan.leagueIds[0]).sportId;
        });

        $scope.turnaroundTimeMinTimeLookup = turnaroundTimeMinTimeLookup;

        var openPlanModal = function(planToEdit) {
            var modalInstance = $modal.open({
                scope: $scope,
                templateUrl: 'app/admin/platform/new-plan/new-plan.html',
                controller: 'NewPlanController',
                resolve: {
                    Plans: function() { return $scope.plans; },
                    PlatformData: function() { return data; },
                    EditPlanObj: function() { return planToEdit; }
                }
            });

            modalInstance.result.then(function closed(savedPlan) {

                plans.save(savedPlan).then(function saved(returnedPlan) {
                    if (!returnedPlan) return;

                    //TODO: returnedPlan.sportId might not be needed
                    returnedPlan.sportId = leagues.get(returnedPlan.leagueIds[0]).sportId;
                    $scope.plans.push(returnedPlan);
                });
            });
        };

        $scope.editPlan = function(plan) {
            openPlanModal(plan);
        };

        $scope.addPlan = function() {
            openPlanModal();
        };
    }
]);
