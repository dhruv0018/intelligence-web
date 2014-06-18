/* Component resources */
var template = require('./new-plan.html');
var moment = require('moment');

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
    '$scope', '$modalInstance', 'TURNAROUND_TIME_RANGES', 'EditPlanObj', 'NewDate', 'PlatformData',
    function controller($scope, $modalInstance, turnaroundTimeRanges, editPlanObj, newDate, data) {

        $scope.defaultPlan = {};
        $scope.defaultPlan.leagueIds = [];

        $scope.sports = data.sports.getList();
        $scope.leagues = data.leagues.getList();

        $scope.maxTurnaroundTimes = turnaroundTimeRanges;

        if (editPlanObj) {
            $scope.defaultPlan = editPlanObj;

            if (editPlanObj.leagueIds.length) {
                //All leagues must have the same sportId, so just grab the first
                //TODO: default plan should have sportId?
                $scope.defaultPlan.sportId = data.leagues.get(editPlanObj.leagueIds[0]).sportId;
            }

            //Format the saved dates for editing
            var startDate = newDate.generate();
            startDate.setMonth($scope.defaultPlan.startMonth - 1);
            startDate.setDate($scope.defaultPlan.startDay);

            $scope.defaultPlan.startDate = startDate;

            var endDate = newDate.generate();
            endDate.setMonth($scope.defaultPlan.endMonth - 1);
            endDate.setDate($scope.defaultPlan.endDay);

            $scope.defaultPlan.endDate = endDate;
        }

        /**
         * Toggles the leagues presence in the default plan.
         */
        $scope.toggleLeagueId = function(league) {

            /* If the league is present in the plan already. */
            if (~$scope.defaultPlan.leagueIds.indexOf(league.id)) {

                /* Remove the league from the plan. */
                $scope.defaultPlan.leagueIds.splice($scope.defaultPlan.leagueIds.indexOf(league.id), 1);
            }

            /* Otherwise; if the league is not present in the plan. */
            else {

                /* Add the league to the plan. */
                $scope.defaultPlan.leagueIds.push(league.id);
            }
        };

        $scope.savePlan = function savePlan() {

            var startDate = moment($scope.defaultPlan.startDate);
            var endDate = moment($scope.defaultPlan.endDate);

            $scope.defaultPlan.startDay = moment(startDate).date();
            $scope.defaultPlan.startMonth = moment(startDate).month() + 1;

            $scope.defaultPlan.endDay = moment(endDate).date();
            $scope.defaultPlan.endMonth = moment(endDate).month() + 1;

            // clean up extra attributes
            delete $scope.defaultPlan.startDate;
            delete $scope.defaultPlan.endDate;

            $modalInstance.close($scope.defaultPlan);

        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
]);
