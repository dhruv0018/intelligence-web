/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * EditProfile.Experience page module.
 * @module EditProfile.Experience
 */
const Experience = angular.module('Athlete.Profile.EditProfile.Experience');

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
    'SessionService',
    'AddProfileTeam.Modal'
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
    session,
    addProfileTeamModal
) {
    $scope.athlete = session.getCurrentUser();
    $scope.teams = teams.getMap();
    $scope.addingTeam = false;
    $scope.options = {
        scope: $scope
    };

    $scope.getPositionSet = function getPositionSet(teamId) {
        let team = teams.get(teamId);
        let league = leagues.get(team.leagueId);
        let positionset = positionsets.get(league.positionSetId);
        return positionset;
    };

    $scope.getPositionsForProfileTeam = function(teamId) {
        let team = teams.get(teamId);
        let league = leagues.get(team.leagueId);
        let positionset = positionsets.get(league.positionSetId);
        let positions = positionset.positions;
        return positions;
    };

    $scope.getTeamSport = function(teamId) {
        let team = teams.get(teamId);
        let league = leagues.get(team.leagueId);
        let sport = sports.get(league.sportId);
        return sport;
    };

    $scope.openTeamModal = function(profileTeam) {
        $scope.profileTeam = profileTeam;
        let modal = addProfileTeamModal.open({
            options: $scope.options
        });

        modal.result.then( () => {

        });
    };
}

Experience.controller('Athlete.Profile.EditProfile.Experience.controller', ExperienceController);

export default ExperienceController;
