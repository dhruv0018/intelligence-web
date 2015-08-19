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
    '$filter',
    'TeamsFactory',
    'LeaguesFactory',
    'SportsFactory',
    'PositionsetsFactory',
    'UsersFactory',
    'SessionService',
    'AddProfileTeam.Modal',
    'BasicModals'
];

/**
 * EditProfile.Experience controller.
 * @module EditProfile.Experience
 * @name EditProfile.Experience.controller
 * @type {controller}
 */
function ExperienceController (
    $scope,
    $filter,
    teams,
    leagues,
    sports,
    positionsets,
    users,
    session,
    addProfileTeamModal,
    basicModals
) {
    $scope.athlete = session.getCurrentUser();
    $scope.teams = teams.getMap();
    $scope.addingTeam = false;

    $scope.getPositionSet = function(teamId) {
        let team = teams.get(teamId);
        let league = leagues.get(team.leagueId);
        let positionset = positionsets.get(league.positionSetId);
        return positionset;
    };

    $scope.getPosition = function(teamId, positionId) {
        let positionset = $scope.getPositionSet(teamId);
        let position = positionset.getPositionById(positionId);
        return position;
    };

    $scope.getProfileTeamSport = function(teamId) {
        let team = teams.get(teamId);
        return team.getSport();
    };

    $scope.openTeamModal = function(profileTeam) {
        let modal = addProfileTeamModal.open({
            resolve: {
                profileTeam: function() { return profileTeam; }
            }
        });
    };

    $scope.removeTeam = function(team) {
        let removeTeamModal = basicModals.openForConfirm({
            title: 'Remove Team',
            bodyText: 'Are you sure you want to remove this team from your profile?',
            buttonText: 'Yes'
        });

        removeTeamModal.result.then(function removeTeamModalCallback() {
            $scope.athlete.removeTeamFromProfile(team.teamId);
            $scope.athlete.save();
        });
    };
}

Experience.controller('Athlete.Profile.EditProfile.Experience.controller', ExperienceController);

export default ExperienceController;
