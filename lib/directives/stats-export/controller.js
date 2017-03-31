/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* StatsExport dependencies
*/
StatsExportController.$inject = [
    '$scope',
    'TeamsFactory',
    'SchoolsFactory',
    'SessionService',
    'SPORT_IDS',
    'SPORTS',
    'SCHOOL_TYPE',
    'TEAM_AGE_LEVELS',
    'ROLES'
];

/**
 * StatsExport controller.
 * @module StatsExport
 * @name StatsExport.controller
 * @type {controller}
 */
function StatsExportController (
    $scope,
    teams,
    schools,
    session,
    SPORT_IDS,
    SPORTS,
    SCHOOL_TYPE,
    TEAM_AGE_LEVELS,
    ROLES
) {

    let team = teams.get(session.getCurrentTeamId());

    if(team) {
        const schoolId = team.schoolId;
        const school = schoolId && schools.get(schoolId);
        const sport = team.getSport();
        //Show max prep if either school or team has been set to HS level
        const isHighSchool = (school && school.type.id === SCHOOL_TYPE.HIGH_SCHOOL)
            || team.ageLevel === TEAM_AGE_LEVELS.SECONDARY.name;
        const isCoach = session.getCurrentUser().is(ROLES.COACH);

        $scope.allowMaxPrepExport = isHighSchool && isCoach;

        const AVAILABLESPORTS = [
            'BASKETBALL',
            'FOOTBALL',
            'LACROSSE',
            'SOCCER',
            'VOLLEYBALL'
        ];

        if (sport && AVAILABLESPORTS.indexOf(SPORT_IDS[sport.id]) > -1) {
            $scope.csvDownloadAvailable = true;
        }

    }
}

export default StatsExportController;
