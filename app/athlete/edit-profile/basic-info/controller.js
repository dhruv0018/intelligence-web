/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.BasicInfo page module.
 * @module EditProfile.BasicInfo
 */
var BasicInfo = angular.module('Athlete.EditProfile.BasicInfo');

/**
 * EditProfile.BasicInfo controller.
 * @module EditProfile.BasicInfo
 * @name EditProfile.BasicInfo.controller
 * @type {controller}
 */
BasicInfo.controller('Athlete.EditProfile.BasicInfo.controller', [
    '$scope', 'SportsFactory', 'PositionsetsFactory', 'Athlete.EditProfile.Data',
    function controller($scope, sports, positionsets, data) {
        $scope.athlete = data.athlete;
        $scope.sports = sports.getList();
        //$scope.positionset = positionsets.get($scope.league.positionSetId);
        $scope.addingTeam = false;
    }
]);
