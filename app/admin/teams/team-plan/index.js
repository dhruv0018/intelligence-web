const angular = window.angular;

/**
 * Team Plan page module.
 * @module team Plan
 */
const TeamPlan = angular.module('team-plan', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * Team Plan controller.
 * @module Team Plan
 * @name TeamPlanController
 * @type {Controller}
 */
TeamPlan.controller('TeamPlanController', [
    '$scope', '$state', '$uibModalInstance', 'TURNAROUND_TIME_RANGES', 'SessionService', 'PlansFactory', 'TeamsFactory', 'Team', 'TeamPlanIndex', 'BasicModals', 'PlanService',
    function controller($scope, $state, $uibModalInstance, TURNAROUND_TIME_RANGES, session, plans, teams, team, teamPlanIndex, basicModals, planService) {

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
                startDate: planService.getStartDateOfPlan(),
                endDate: planService.getEndDateOfPlan(),
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
                $scope.teamPlan.startDate = planService.getStartDateOfPlan(plan);
                $scope.teamPlan.endDate = planService.getEndDateOfPlan(plan);

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

                $uibModalInstance.close(team);
            }

        };

    }
]);

export default TeamPlan;
