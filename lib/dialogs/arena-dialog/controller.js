/**
 * ArenaDialog Controller
 * @module ArenaDialog
 * @name ArenaDialog.Controller
 * @type {Controller}
 */

ArenaDialogController.$inject = [
    '$scope'
];

function ArenaDialogController(
    $scope
) {

    /* Initialize variables */

    if (!$scope.event.variableValues[$scope.item.id].value) {

        $scope.event.variableValues[$scope.item.id].value = {

            coordinates: {
                x: null,
                y: null
            },
            region: {
                id: null
            }
        };
    }
}

export default ArenaDialogController;
