/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* StatsExport dependencies
*/
StatsExportController.$inject = [
    '$scope',
    'TeamsFactory',
    'SessionService',
    'SPORT_IDS',
    'SPORTS'
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
    session,
    SPORT_IDS,
    SPORTS
) {

    let team = teams.get(session.getCurrentTeamId());
    $scope.csvDownloadAvailable = false;

    if(team) {

        let sport = team.getSport();
        if (sport) {

            if (SPORT_IDS[sport.id] === 'BASKETBALL' || SPORT_IDS[sport.id] === 'LACROSSE') {
                $scope.csvDownloadAvailable = true;
            }
        }

    }

}

export default StatsExportController;
