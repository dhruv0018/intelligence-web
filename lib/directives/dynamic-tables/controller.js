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

    $scope.$watch('tables', function(newValue, oldValue){
        $scope.selectedTableObject = newValue[0];
    });

    $scope.selectedTable = 0;

    $scope.onTableSelect = function(){
        $scope.selectedTable = $scope.tables.indexOf($scope.selectedTableObject);
    };
}

export default DynamicTablesController;
