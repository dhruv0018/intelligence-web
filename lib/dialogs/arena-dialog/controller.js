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
    'EventManager',
    'ARENA_TYPES'
];

function ArenaDialogController(
    $scope,
    item,
    league,
    eventManager,
    ARENA_TYPES
) {

    /* Broadcast locals on the scope */

    $scope.arenaType = ARENA_TYPES[league.arenaId].type;
    $scope.eventManager = eventManager;
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
