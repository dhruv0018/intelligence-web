/**
* DynamicTables.Controller dependencies
*/
DynamicTablesController.$inject = [
    '$scope',
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
    SPORTS
) {
    console.log('sport', $scope.sport);
    $scope.selectedTable = 0;
    $scope.onTableSelect = $index => $scope.selectedTable = $index;
    $scope.isBasketball = ($scope.sport && $scope.sport.id === SPORTS.BASKETBALL.id) ? true : false;
}

export default DynamicTablesController;
