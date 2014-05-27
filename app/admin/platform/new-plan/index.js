/* Component resources */
var template = require('./new-plan.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * New Plan page module.
 * @module New Plan
 */
var NewPlan = angular.module('new-plan', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
NewPlan.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('app/admin/platform/new-plan/new-plan.html', template);
    }
]);

/**
 * New Plan controller.
 * @module New Plan
 * @name NewPlanController
 * @type {Controller}
 */
NewPlan.controller('NewPlanController', [
    '$scope', '$state', '$modalInstance', 'SessionService', 'SportsFactory', 'LeaguesFactory', 'PlansFactory',
    function controller($scope, $state, $modalInstance, session, sports, leagues, plans) {

        $scope.sports = sports.getList({}, function(sports) {
            return sports;
        });
        $scope.leagues = leagues.getList({}, function(leagues) {

            return leagues;
        });
        console.log($scope.leagues);
        console.log($scope.sports);

        $scope.savePlan = function(plan) {
            plans.save(plan);
        };

    }
]);
