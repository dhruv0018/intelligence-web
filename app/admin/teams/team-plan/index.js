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
    '$scope', '$state', '$modalInstance', 'TURNAROUND_TIME_RANGES', 'SessionService', 'PlansFactory', 'TeamsFactory', 'Team', 'TeamPlanIndex', 'NewDate', 'BasicModals',
    function controller($scope, $state, $modalInstance, TURNAROUND_TIME_RANGES, session, plans, teams, team, teamPlanIndex, dateZeroTime, basicModals) {

        $scope.team = team;
        $scope.team.teamPlans = $scope.team.teamPlans || [];
        $scope.defaultPlan = {};
        $scope.turnaroundTimes = TURNAROUND_TIME_RANGES;

        if ($scope.team && $scope.team.teamPlans[teamPlanIndex]) {
            $scope.editing = true;
            $scope.teamPlan = angular.copy($scope.team.teamPlans[teamPlanIndex]);
        }

        if (!$scope.teamPlan) {
            $scope.teamPlan = {
                startDate: dateZeroTime.generatePlanStartDate(),
                endDate: dateZeroTime.generatePlanEndDate(),
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
                delete $scope.teamPlan.id; //prevent overwriting default plan on server

                //Format the saved dates for editing
                if (plan.startDay && plan.startMonth) {
                    var startDate = dateZeroTime.generatePlanStartDate();
                    startDate.setMonth(plan.startMonth);
                    startDate.setDate(plan.startDay);

                    $scope.teamPlan.startDate = startDate;
                }

                if (plan.endDay && plan.endMonth) {
                    var endDate = dateZeroTime.generatePlanEndDate();
                    endDate.setMonth(plan.endMonth);
                    endDate.setDate(plan.endDay);

                    $scope.teamPlan.endDate = endDate;
                }

            }
        });

        $scope.defaultPlans = plans.getByLeague(team.leagueId);

        $scope.saveTeam = function(team) {

            var basicModalOptions = {};
            var basicModalInstance;
            if ($scope.teamPlan.startDate >= $scope.teamPlan.endDate) {
                basicModalOptions.title = 'Plan end date must be after the start date!';
                basicModalInstance = basicModals.openForAlert(basicModalOptions);
            } else {
                if (!team.teamPlans) {
                    team.teamPlans = [];
                }

                if ($scope.editing) {
                    team.teamPlans[teamPlanIndex] = $scope.teamPlan;
                } else {
                    team.teamPlans.push($scope.teamPlan);
                }

                $modalInstance.close(team);
            }

        };

    }
]);
