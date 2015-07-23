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

    $scope.eventManager = eventManager;
    $scope.item = item;

    /* krossover-arena specific data */

    let arena = ARENA_TYPES[league.arenaId];
    $scope.arenaType = arena.type;
    $scope.arenaOrientation = arena.orientation;

    /* Initialize variables */

    if (eventManager.current && !eventManager.current.variableValues[item.id].value) {

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
