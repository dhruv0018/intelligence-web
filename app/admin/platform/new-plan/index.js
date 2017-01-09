const moment = require('moment');
const angular = window.angular;

/**
 * New Plan page module.
 * @module New Plan
 */
const NewPlan = angular.module('new-plan', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * New Plan controller.
 * @module New Plan
 * @name NewPlanController
 * @type {Controller}
 */
NewPlan.controller('NewPlanController', [
    '$scope', '$uibModalInstance', 'TURNAROUND_TIME_RANGES', 'EditPlanObj', 'PlanService', 'PlatformData', 'SportsFactory', 'LeaguesFactory',
    function controller($scope, $uibModalInstance, turnaroundTimeRanges, editPlanObj, planService, data, sports, leagues) {

        $scope.defaultPlan = {};
        $scope.defaultPlan.leagueIds = [];

        $scope.sports = sports.getList();
        $scope.leagues = leagues.getList();

        $scope.maxTurnaroundTimes = turnaroundTimeRanges;

        $scope.defaultPlan.startDate = planService.getStartDateOfPlan();
        $scope.defaultPlan.endDate = planService.getEndDateOfPlan();

        if (editPlanObj) {
            $scope.defaultPlan = angular.copy(editPlanObj);

            if (editPlanObj.leagueIds.length) {
                //All leagues must have the same sportId, so just grab the first
                //TODO: default plan should have sportId?
                $scope.defaultPlan.sportId = leagues.get(editPlanObj.leagueIds[0]).sportId;
            }

            $scope.defaultPlan.startDate = planService.getStartDateOfPlan($scope.defaultPlan);
            $scope.defaultPlan.endDate = planService.getEndDateOfPlan($scope.defaultPlan);
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

            $scope.defaultPlan.startDay = $scope.defaultPlan.startDate.getDate();
            $scope.defaultPlan.startMonth = $scope.defaultPlan.startDate.getMonth();

            $scope.defaultPlan.endDay = $scope.defaultPlan.endDate.getDate();
            $scope.defaultPlan.endMonth = $scope.defaultPlan.endDate.getMonth();

            var returnObj = $scope.defaultPlan;

            if (editPlanObj) {
                angular.extend(editPlanObj, $scope.defaultPlan);
                returnObj = editPlanObj;
            }

            $uibModalInstance.close(returnObj);

        };
    }
]);

export default NewPlan;
