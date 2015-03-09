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
    '$scope', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'PositionsetsFactory', 'SessionService', 'Athlete.EditProfile.Data',
    function controller($scope, teams, leagues, sports, positionsets, session, data) {
        $scope.athlete = data.athlete;
        $scope.sports = sports.getList();
        //$scope.positionset = positionsets.get($scope.league.positionSetId);
        $scope.addingTeam = false;
    }
]);
