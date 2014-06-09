/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team Plan page module.
 * @module team Plan
 */
var TeamPlan = angular.module('team-plan', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamPlan.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('app/admin/teams/team-plan/team-plan.html', template);
    }
]);

/**
 * Team Plan controller.
 * @module Team Plan
 * @name TeamPlanController
 * @type {Controller}
 */
TeamPlan.controller('TeamPlanController', [
    '$scope', '$state', '$modalInstance', 'TURNAROUND_TIME_RANGES', 'SessionService', 'PlansFactory', 'TeamsFactory', 'Team', 'TeamPlanIndex',
    function controller($scope, $state, $modalInstance, TURNAROUND_TIME_RANGES, session, plans, teams, team, teamPlanIndex) {

        $scope.team = team;
        $scope.team.teamPlans = $scope.team.teamPlans || [];
        $scope.defaultPlan = {};
        $scope.turnaroundTimes = {};
        $scope.turnaroundTimes.options = TURNAROUND_TIME_RANGES;

        console.log($scope);

        if ($scope.team && $scope.team.teamPlans[teamPlanIndex]) {
            $scope.editing = true;
            $scope.teamPlan = angular.copy($scope.team.teamPlans[teamPlanIndex]);
        } else {
            console.log('undefined');
        }

        var dateZeroTime = new Date();
        dateZeroTime.setUTCHours(0,0,0,0);

        if (!$scope.teamPlan) {
            $scope.teamPlan = {
                startDate: dateZeroTime,
                endDate: dateZeroTime,
                name: '',
                maxGamesPerPlan: 0,
                maxRegularGames: 0,
                maxScoutingGames: 0,
                maxAnyGames: 0,
            };
        }

        $scope.$watch('defaultPlan.selected', function(plan) {

            if (plan) {
                $scope.teamPlan = angular.copy(plan);

                if (plan.startDay && plan.startMonth) {

                    plan.startDate = moment();
                    plan.startDate.date(plan.startDay);
                    plan.startDate.month(plan.startMonth - 1);
                    $scope.teamPlan.startDate = plan.startDate.toDate();
                }

                if (plan.endDay && plan.endMonth) {

                    plan.endDate = moment();
                    plan.endDate.date(plan.endDay);
                    plan.endDate.month(plan.endMonth - 1);
                    $scope.teamPlan.endDate = plan.endDate.toDate();
                }

                console.log($scope.teamPlan);
            }
        });

        $scope.defaultPlans = plans.getList();

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.saveTeam = function(team) {

            if (!team.teamPlans) {
                team.teamPlans = [];
            }

            if ($scope.editing) {
                team.teamPlans[teamPlanIndex] = $scope.teamPlan;
            } else {
                team.teamPlans.push($scope.teamPlan);
            }

            $modalInstance.close(team);
        };

    }
]);
