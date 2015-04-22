/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AthleteResume page module.
 * @module AthleteResume
 */
var AthleteResume = angular.module('AthleteResume');

/*
* AthleteResume dependencies
*/
AthleteResumeController.$inject = [
    '$scope',
    '$filter',
    'TeamsFactory',
    'LeaguesFactory',
    'PositionsetsFactory',
    'ATHLETE_DOMINANT_HAND_TYPES',
    'ATHLETE_DOMINANT_HAND_TYPES_ID'
];

/**
 * AthleteResume controller.
 * @module AthleteResume
 * @name AthleteResume.controller
 * @type {controller}
 */
function AthleteResumeController (
    $scope,
    $filter,
    teams,
    leagues,
    positionsets,
    ATHLETE_DOMINANT_HAND_TYPES,
    ATHLETE_DOMINANT_HAND_TYPES_ID
) {
    $scope.teams = teams.getMap();
    $scope.ATHLETE_DOMINANT_HAND_TYPES = ATHLETE_DOMINANT_HAND_TYPES;
    $scope.ATHLETE_DOMINANT_HAND_TYPES_ID = ATHLETE_DOMINANT_HAND_TYPES_ID;

    // Variables for toggling
    $scope.toggleExperience = document.getElementById('toggle-experience');
    $scope.toggleAcademics = document.getElementById('toggle-academics');
    $scope.togglePhysical = document.getElementById('toggle-physical');

    $scope.getPositionsForProfileTeam = function getPositionsForProfileTeam(profileTeam) {
        let team = teams.get(profileTeam.teamId);
        let league = leagues.get(team.leagueId);
        let positionset = positionsets.get(league.positionSetId);
        let positions = positionset.positions;
        return positions;
    };
}

AthleteResume.controller('AthleteResume.Controller', AthleteResumeController);

export default AthleteResumeController;
