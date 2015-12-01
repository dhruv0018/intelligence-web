/**
* DynamicTables.Controller dependencies
*/
DynamicTablesController.$inject = [
    '$scope',
    'TeamsFactory',
    'SessionService',
    'SPORT_IDS',
    'SPORTS'
];

/**
 * DynamicTables.Controller
 * @module DynamicTables
 * @name DynamicTables.Controller
 * @type {Controller}
 */
function DynamicTablesController (
    $scope,
    teams,
    session,
    SPORT_IDS,
    SPORTS
) {

    $scope.selectedTable = 0;
    $scope.onTableSelect = $index => $scope.selectedTable = $index;

    let team = teams.get(session.getCurrentTeamId());
    let sport;

    if(team) {

        sport = team.getSport();
        $scope.isBasketball = (sport && sport.id === SPORTS.BASKETBALL.id) ? true : false;
    }
}

export default DynamicTablesController;
