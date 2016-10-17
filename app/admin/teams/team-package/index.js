const angular = window.angular;

/**
 * Team Package page module.
 * @module Team Package
 */
const TeamPackage = angular.module('team-package', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * Team Package controller.
 * @module Team Package
 * @name TeamPackageController
 * @type {Controller}
 */
TeamPackage.controller('TeamPackageController', [
    '$scope', '$state', '$modalInstance', 'SessionService', 'Team', 'PackageIndex', 'TURNAROUND_TIME_RANGES', 'NewDate', 'BasicModals',
    function controller($scope, $state, $modalInstance, session, team, packageIndex, TURNAROUND_TIME_RANGES, dateZeroTime, basicModals) {

        $scope.edit = false;

        team.teamPackages = team.teamPackages || [];
        $scope.TURNAROUND_TIME_RANGES = TURNAROUND_TIME_RANGES;
        $scope.teamPackageObj = {};

        $scope.teamPackageObj.startDate = dateZeroTime.generatePackageStartDate();
        $scope.teamPackageObj.endDate = dateZeroTime.generatePackageEndDate();

        //Set packageIndex to package index to edit
        //before opening modal
        if (team.teamPackages[packageIndex]) {
            $scope.edit = true;

            $scope.teamPackageObj = angular.copy(team.teamPackages[packageIndex]);
        }

        $scope.saveTeamPackage = function() {

            var basicModalOptions = {};
            var basicModalInstance;
            if ($scope.teamPackageObj.startDate >= $scope.teamPackageObj.endDate) {
                basicModalOptions.title = 'Package end date must be after the start date!';
                basicModalInstance = basicModals.openForAlert(basicModalOptions);
            } else {

                //TODO: validation?
                if (!$scope.edit) {
                    team.teamPackages.push($scope.teamPackageObj);
                } else {
                    team.teamPackages[packageIndex] = $scope.teamPackageObj;
                }

                $modalInstance.close(team);
            }
        };
    }
]);

export default TeamPackage;
