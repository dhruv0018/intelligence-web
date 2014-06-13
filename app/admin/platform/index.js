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
                }
            })

            .state('plan-defaults', {
                url: '',
                parent: 'platform',
                views: {
                    'content@platform': {
                        templateUrl: 'plan-defaults.html',
                        controller: 'PlatformController'
                    }
                }
            });
    }
]);

Platform.filter('monthFilter', function() {
    return function(monthNumber) {
        return moment(moment().month(moment(monthNumber) - 1)).format('MMM');
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
    '$scope', '$modal',  'LeaguesFactory', 'PlansFactory', 'SportsFactory',
    function controller($scope, $modal, leagues, plans, sports) {

        $scope.leagues = leagues.getList({}, function(leagues) {
            return leagues;
        }, null, true);

        plans.getList().$promise.then(function(plansList) {

            $scope.plans = plansList;

            $scope.leagues.$promise.then(function loaded(resolved) {
                //TODO: plan should have sportId
                angular.forEach($scope.plans, function(plan) {
                    //TODO: get rid of promise,then with new data service
                    plan.sportId = $scope.leagues[plan.leagueIds[0] - 1].sportId;
                });
            });

        });

        $scope.sports = sports.getList();

        var openPlanModal = function(planToEdit) {
            var modalInstance = $modal.open({
                scope: $scope,
                templateUrl: 'app/admin/platform/new-plan/new-plan.html',
                controller: 'NewPlanController',
                resolve: {
                    Plans: function() { return $scope.plans; },
                    EditPlanObj: function() { return planToEdit; }
                }
            });

            modalInstance.result.then(function closed(savedPlan) {
                plans.save(savedPlan).then(function saved(ret) {
                    if (!savedPlan.id) {
                        $scope.plans.push(ret);
                    }
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

