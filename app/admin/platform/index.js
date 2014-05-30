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

Platform.controller('PlatformController', [
    '$scope', '$modal',  'LeaguesFactory', 'PlansFactory',
    function controller($scope, $modal, leagues, plans) {

        plans.getList().$promise.then(function(plans) {
            // $scope.plans = plans;

            angular.forEach(plans, function(plan) {
                // console.log(plan);
                var startMonth = moment(plan.startMonth) - 1;
                var endMonth = moment(plan.endMonth) - 1;

                startMonth = moment().month(startMonth);
                endMonth = moment().month(endMonth);


                plan.endMonth = moment(endMonth).format('MMM');
                plan.startMonth = moment(startMonth).format('MMM');


                console.log(plan.startMonth);
            });
            // console.log(plans);
            $scope.plans = plans;
        });


        $scope.leagues = leagues.getList({}, function(leagues) {
            return leagues;
        }, null, true);

        // $scope.plans.$promise.then(function(plan) {
        //     console.log('wutwut');
        //     console.log(plan);
        // // });

        // console.log($scope.plans);
        // $scope.plans.forEach(function(plan) {
        //     console.log('wut');
        // });

        $scope.addPlan = function() {
            $modal.open({
                templateUrl: 'app/admin/platform/new-plan/new-plan.html',
                controller: 'NewPlanController'
            });
        };
    }
]);

