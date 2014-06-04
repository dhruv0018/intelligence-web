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
    function controller($scope, $state, $modalInstance, session, Team, PackageIndex, TURNAROUND_TIME_RANGES, TURNAROUND_TIME_MIN_TIME_LOOKUP) {

        var edit = false;
        console.log($scope);
        console.log(Team);
        console.log(PackageIndex);

        Team.teamPackages = Team.teamPackages || [];
        $scope.TURNAROUND_TIME_RANGES = TURNAROUND_TIME_RANGES;
        $scope.teamPackageObj = {};

        $scope.teamPackageObj.startDate = new Date();
        $scope.teamPackageObj.endDate = new Date();

        //Set $scope.editTeamPackageObj to team package object to edit
        //before opening modal
        if (Team.teamPackages[PackageIndex]) {
            edit = true;

            $scope.teamPackageObj = Team.teamPackages[PackageIndex];

            if (angular.isString($scope.teamPackageObj.startDate) && !isNaN(new Date($scope.teamPackageObj.startDate).getTime())) $scope.teamPackageObj.startDate = new Date($scope.teamPackageObj.startDate);
            if (angular.isString($scope.teamPackageObj.endDate) && !isNaN(new Date($scope.teamPackageObj.endDate).getTime())) $scope.teamPackageObj.endDate = new Date($scope.teamPackageObj.endDate);
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.saveTeamPackage = function() {

            $scope.teamPackageObj.startDate = $scope.teamPackageObj.startDate.toISOString();
            $scope.teamPackageObj.endDate = $scope.teamPackageObj.endDate.toISOString();
            $scope.teamPackageObj.minTurnaroundTime = TURNAROUND_TIME_MIN_TIME_LOOKUP[$scope.teamPackageObj.maxTurnaroundTime];

            //TODO: validation?
            console.log(edit, $scope);
            console.log(Team);
            if (!edit) {
                Team.teamPackages.push($scope.teamPackageObj);
            }

            $modalInstance.close(Team);
        };
    }
]);

