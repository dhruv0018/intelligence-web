/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* StatsExport dependencies
*/
StatsExportController.$inject = [
    '$scope',
    'TeamsFactory',
    'SessionService',
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
    SPORTS
) {

    let team = teams.get(session.getCurrentTeamId());

    if(team) {

        let sport = team.getSport();
        $scope.showExport = (!sport || sport.id === SPORTS.LACROSSE.id) ? false : true;
    }

}

export default StatsExportController;
