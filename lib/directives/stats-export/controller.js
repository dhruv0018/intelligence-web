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
    let sport;

    if(team) {

        sport = team.getSport();
        $scope.showExport = (!sport || sport.id === SPORTS.LACROSSE.id) ? false : true;
    }

    $scope.csvDownloadAvailable = false;

    if (sport) {

        if (SPORT_IDS[sport.id] === 'BASKETBALL') {
            $scope.csvDownloadAvailable = true;
        }
    }
}

export default StatsExportController;
