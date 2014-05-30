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

        $scope.plans = plans.getList({}, function(plans) {
            plans.forEach(function(plan) {
                plan.startMonth = moment(plan.startMonth).month();
                plan.endMonth = moment(plan.endMonth).month();
            });
            console.log(plans);
            return plans;
        });

        $scope.leagues = leagues.getList({}, function(leagues) {
            return leagues;
        }, null, true);

        console.log($scope.plans);

        $scope.addPlan = function() {
            $modal.open({
                templateUrl: 'app/admin/platform/new-plan/new-plan.html',
                controller: 'NewPlanController'
            });
        };
    }
]);

