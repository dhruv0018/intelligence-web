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
    $scope.$watch('sport', function(newValue, oldValue){
        $scope.isBasketballOrLax = ($scope.sport && ($scope.sport.id === SPORTS.BASKETBALL.id || $scope.sport.id === SPORTS.LACROSSE.id)) ? true : false;
    });
    $scope.selectedTable = 0;
    $scope.onTableSelect = $index => $scope.selectedTable = $index;
}

export default DynamicTablesController;
