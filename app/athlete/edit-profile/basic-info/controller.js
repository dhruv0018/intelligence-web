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
        $scope.athlete = session.currentUser;
        $scope.teams = teams.getMap();
        $scope.leagues = leagues.getList();
        $scope.sports = sports.getList();
        $scope.positionsets = positionsets;
        $scope.addingTeam = false;
        $scope.newTeam = {};

        $scope.addTeam = function() {
            $scope.newTeam.teamId = teamFromTypeahead.id;
            $scope.athlete.profile.teams.push($scope.newTeam);
        };

        $scope.getPositionSet = function(teamId) {
            var team = $scope.teams[teamId];
            var league = leagues.get(team.leagueId);
            console.log(positionsets.get(league.positionSetId));
            var positionset = positionsets.get(league.positionSetId);
            return positionset;
        };
    }
]);
