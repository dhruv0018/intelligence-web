ArenaDialogController.$inject = [
    '$scope'
];

function ArenaDialogController(
    $scope
) {
    console.log($scope.field);
    /* Broadcast locals on the scope */

    // $scope.eventManager = eventManager;
    // $scope.item = item;
    //
    // /* krossover-arena specific data */
    //
    // let arena = ARENA_TYPES[league.arenaId];
    // $scope.arenaType = arena.type;
    // $scope.arenaOrientation = arena.orientation;
    //
    // /* Initialize variables */
    //
    // if (!eventManager.current.variableValues[item.id].value) {
    //
    //     eventManager.current.variableValues[item.id].value = {
    //
    //         coordinates: {
    //             x: null,
    //             y: null
    //         },
    //         region: {
    //             id: null
    //         }
    //     };
    // }
    //console.log('hello');
}

export default ArenaDialogController;
