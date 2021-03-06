import Leagues from './leagues';
import NewPlan from './new-plan';
import Associations from './associations';

const moment = require('moment');
const angular = window.angular;

/**
 * Platform module.
 * @module Platform
 */
const Platform = angular.module('platform', [
    'ui.router',
    'ui.bootstrap',
    'leagues',
    'new-plan',
    'associations'
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
                        templateUrl: 'app/admin/platform/platform.html',
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
                        templateUrl: 'app/admin/platform/plan-defaults.html'
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
    '$scope', '$uibModal', 'TURNAROUND_TIME_MIN_TIME_LOOKUP', 'Platform.Data', 'SportsFactory', 'LeaguesFactory', 'PlansFactory',
    function controller($scope, $uibModal, turnaroundTimeMinTimeLookup, data, sports, leagues, plans) {

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
            var modalInstance = $uibModal.open({
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

export default Platform;
