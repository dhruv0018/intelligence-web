/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * AthleteResume page module.
 * @module AthleteResume
 */
const AthleteResume = angular.module('AthleteResume');

/*
* AthleteResume dependencies
*/
AthleteResumeController.$inject = [
    '$scope',
    '$filter',
    'TeamsFactory',
    'LeaguesFactory',
    'SportsFactory',
    'PositionsetsFactory',
    'SessionService',
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
    sports,
    positionsets,
    session,
    ATHLETE_DOMINANT_HAND_TYPES,
    ATHLETE_DOMINANT_HAND_TYPES_ID
) {
    $scope.isCurrentUser = false;
    if ($scope.athlete.id === session.getCurrentUserId()) $scope.isCurrentUser = true;


    $scope.teams = teams.getMap();
    $scope.sports = sports.getMap();
    $scope.ATHLETE_DOMINANT_HAND_TYPES = ATHLETE_DOMINANT_HAND_TYPES;
    $scope.ATHLETE_DOMINANT_HAND_TYPES_ID = ATHLETE_DOMINANT_HAND_TYPES_ID;

    // Variables for toggling
    $scope.toggleExperience = document.getElementById('toggle-experience');
    $scope.toggleAcademics = document.getElementById('toggle-academics');
    $scope.togglePhysical = document.getElementById('toggle-physical');

    // Check to see if sections are filled out
    $scope.hasHighSchoolInfo = false;
    $scope.hasCollegeInfo = false;
    $scope.hasPhysicalInfo = false;

    if ($scope.athlete.profile.highSchool ||
        $scope.athlete.profile.highSchoolGraduationYear ||
        $scope.athlete.profile.highSchoolGpa ||
        $scope.athlete.profile.satScore ||
        $scope.athlete.profile.actScore) {

        $scope.hasHighSchoolInfo = true;
    }

    if ($scope.athlete.profile.college ||
        $scope.athlete.profile.collegeGraduationYear ||
        $scope.athlete.profile.intendedMajor) {

        $scope.hasCollegeInfo = true;
    }

    if ($scope.athlete.profile.height ||
        $scope.athlete.profile.weight ||
        $scope.athlete.profile.dominantHandType ||
        $scope.athlete.profile.oneMileTime ||
        $scope.athlete.profile.threeMileTime ||
        $scope.athlete.profile.fortyYardDash ||
        $scope.athlete.profile.benchPress ||
        $scope.athlete.profile.clean ||
        $scope.athlete.profile.deadlift ||
        $scope.athlete.profile.squat ||
        $scope.athlete.profile.verticalLeap ||
        $scope.athlete.profile.wingspan) {

        $scope.hasPhysicalInfo = true;
    }

    $scope.getProfileTeamSport = function(teamId) {
        let team = teams.get(teamId);
        return team.getSport();
    };

    $scope.getPositionForProfileTeam = function(profileTeam, positionId) {
        let team = teams.get(profileTeam.teamId);
        let league = leagues.get(team.leagueId);
        let positionset = positionsets.get(league.positionSetId);
        let position = positionset.getPositionById(positionId);
        return position;
    };
}

AthleteResume.controller('AthleteResume.Controller', AthleteResumeController);

export default AthleteResumeController;
