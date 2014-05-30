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

        $scope.defaultPlan = {};
        $scope.defaultPlan.leagueIds = [];

        $scope.sports = sports.getList({}, function(sports) {
            return sports;
        });
        $scope.leagues = leagues.getList({}, function(leagues) {

            return leagues;
        });
        console.log($scope.leagues);
        console.log($scope.sports);

        /**
         * Toggles the leagues presence in the default plan.
         * @param {Number} leagueId - the ID of the league to toggle.
         */
        $scope.toggleLeagueId = function(leagueId) {

            /* If the league is present in the plan already. */
            if (~$scope.defaultPlan.leagueIds.indexOf(leagueId)) {

                /* Remove the league from the plan. */
                $scope.defaultPlan.leagueIds.splice($scope.defaultPlan.leagueIds.indexOf(leagueId), 1);
            }

            /* Otherwise; if the league is not present in the plan. */
            else {

                /* Add the league to the plan. */
                $scope.defaultPlan.leagueIds.push(leagueId);
            }
        };

        $scope.savePlan = function(plan) {
            plans.save(plan);
        };

    }
]);
