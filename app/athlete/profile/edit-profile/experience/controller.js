/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Experience page module.
 * @module EditProfile.Experience
 */
var Experience = angular.module('Athlete.Profile.EditProfile.Experience');

/*
* EditProfile.Experience dependencies
*/
ExperienceController.$inject = [
    '$scope',
    'TeamsFactory',
    'LeaguesFactory',
    'SportsFactory',
    'PositionsetsFactory',
    'UsersFactory',
    'SessionService'
];

/**
 * EditProfile.Experience controller.
 * @module EditProfile.Experience
 * @name EditProfile.Experience.controller
 * @type {controller}
 */
function ExperienceController (
    $scope,
    teams,
    leagues,
    sports,
    positionsets,
    users,
    session
) {
    $scope.athlete = session.getCurrentUser();
    $scope.teams = teams.getMap();
    $scope.addingTeam = false;

    $scope.getPositionSet = function getPositionSet(teamId) {
        let team = teams.get(teamId);
        let league = leagues.get(team.leagueId);
        let positionset = positionsets.get(league.positionSetId);
        return positionset;
    };

    $scope.getTeamSportName = function getTeamSportName(teamId) {
        let team = teams.get(teamId);
        let league = leagues.get(team.leagueId);
        let sport = sports.get(league.sportId);
        return sport.name;
    };
}

Experience.controller('Athlete.Profile.EditProfile.Experience.controller', ExperienceController);

export default ExperienceController;
