/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team Package page module.
 * @module Team Package
 */
var TeamPackage = angular.module('team-package', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamPackage.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('app/admin/teams/team-package/team-package.html', template);
    }
]);

/**
 * Team Package controller.
 * @module Team Package
 * @name TeamPackageController
 * @type {Controller}
 */
TeamPackage.controller('TeamPackageController', [
    '$scope', '$state', '$modalInstance', 'SessionService', 'Team', 'PackageIndex', 'TURNAROUND_TIME_RANGES', 'TURNAROUND_TIME_MIN_TIME_LOOKUP',
    function controller($scope, $state, $modalInstance, session, team, packageIndex, TURNAROUND_TIME_RANGES, TURNAROUND_TIME_MIN_TIME_LOOKUP) {

        $scope.edit = false;

        team.teamPackages = team.teamPackages || [];
        $scope.TURNAROUND_TIME_RANGES = TURNAROUND_TIME_RANGES;
        $scope.teamPackageObj = {};

        $scope.teamPackageObj.startDate = new Date();
        $scope.teamPackageObj.endDate = new Date();

        //Set packageIndex to package index to edit
        //before opening modal
        if (team.teamPackages[packageIndex]) {
            $scope.edit = true;

            $scope.teamPackageObj = angular.copy(team.teamPackages[packageIndex]);
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.saveTeamPackage = function() {

            $scope.teamPackageObj.minTurnaroundTime = TURNAROUND_TIME_MIN_TIME_LOOKUP[$scope.teamPackageObj.maxTurnaroundTime];

            //TODO: validation?
            if (!$scope.edit) {
                team.teamPackages.push($scope.teamPackageObj);
            } else {
                team.teamPackages[packageIndex] = $scope.teamPackageObj;
            }

            $modalInstance.close(team);
        };
    }
]);

