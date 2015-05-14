/**
 * ArenaDialog Controller
 * @module ArenaDialog
 * @name ArenaDialog.Controller
 * @type {Controller}
 */

ArenaDialogController.$inject = [
    '$scope',
    'item',
    'league',
    'EventManager'
];

function ArenaDialogController(
    $scope,
    item,
    league,
    eventManager
) {

    /* Broadcast locals on the scope */

    $scope.eventManager = eventManager;
    $scope.league = league;
    $scope.item = item;

    /* Initialize variables */

    if (!eventManager.current.variableValues[item.id].value) {

        eventManager.current.variableValues[item.id].value = {

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
