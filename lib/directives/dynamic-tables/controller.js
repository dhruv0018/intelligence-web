/**
* DynamicTables.Controller dependencies
*/
DynamicTablesController.$inject = [
    '$scope'
];

/**
 * DynamicTables.Controller
 * @module DynamicTables
 * @name DynamicTables.Controller
 * @type {Controller}
 */
function DynamicTablesController (
    $scope
) {

    $scope.tableKeys = Object.keys($scope.tables);
    $scope.selectedTable = 0;

    $scope.onTableSelect = $index => $scope.selectedTable = $index;
}

export default DynamicTablesController;
