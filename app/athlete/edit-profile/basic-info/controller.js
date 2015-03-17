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
        $scope.leagues = leagues.getMap();
        $scope.sports = sports.getMap();
        $scope.positionsets = positionsets;
        $scope.addingTeam = false;
        $scope.newTeam = {};

        $scope.addTeam = function() {
            $scope.newTeam.teamId = $scope.teamFromTypeahead.id;
            $scope.athlete.profile.teams.push($scope.newTeam);
        };

        $scope.removeTeam = function(teamId) {
            for (var index = 0; index < $scope.athlete.profile.teams.length; index++) {
                if ($scope.athlete.profile.teams[index].teamId == teamId) {
                    $scope.athlete.profile.teams.splice(index, 1);
                }
            }
        };

        $scope.getPositionSet = function(teamId) {
            let team = teams.get(teamId);
            let league = leagues.get(team.leagueId);
            let positionset = positionsets.get(league.positionSetId);
            return positionset;
        };
    }
]);
