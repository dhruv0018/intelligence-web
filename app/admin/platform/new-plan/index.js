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
    '$scope', '$state', '$modalInstance', 'SessionService', 'SportsFactory', 'LeaguesFactory', 'PlansFactory',
    function controller($scope, $state, $modalInstance, session, sports, leagues, plans) {

        $scope.defaultPlan = {};
        $scope.defaultPlan.leagueIds = [];
        $scope.sports = sports.getList();
        $scope.leagues = leagues.getList();

        /**
         * Toggles the leagues presence in the default plan.
         * @param {Number} leagueId - the ID of the league to toggle.
         */
        $scope.toggleLeagueId = function(leagueId) {
            leagueId = leagueId - 1;

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

        $scope.maxTurnaroundTimes = [
            {time: '12-24', value: 24},
            {time: '24-36', value: 36},
            {time: '36-48', value: 48}
        ];

        console.log($scope.leagues);


        $scope.savePlan = function(plan) {
            console.log($scope.defaultPlan);
            plan.leagueIds = $scope.defaultPlan.leagueIds;

            var startDate = moment(plan.startDate);
            var endDate = moment(plan.endDate);

            plan.startDay = moment(startDate).date();
            plan.startMonth = moment(startDate).month() + 1;

            plan.endDay = moment(endDate).date();
            plan.endMonth = moment(endDate).month() + 1;

            plan.maxTurnaroundTime = plan.turnaroundInterval.value;

            // clean up extra attributes
            delete plan.startDate;
            delete plan.endDate;
            delete plan.turnaroundInterval;

            plans.save(plan);

            $modalInstance.close();

        };
    }
]);
