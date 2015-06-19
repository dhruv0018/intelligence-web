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

    $scope.selectedTable = 0;
    $scope.onTableSelect = $index => $scope.selectedTable = $index;
}

export default DynamicTablesController;
