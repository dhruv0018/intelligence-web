ArenaDialogController.$inject = [
    '$scope',
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory'
];

function ArenaDialogController(
    $scope,
    ARENA_TYPES,
    games,
    teams,
    leagues
) {
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
    //$scope.arenaType =  'BASKETBALL_NBA';
    //$scope.arenaOrientation = 'landscape';
    let game = games.get($scope.field.gameId);
    let team = teams.get(game.teamId);
    let league = leagues.get(team.leagueId);
    let arena = ARENA_TYPES[league.arenaId];
    $scope.arenaType = arena.type;
    $scope.arenaOrientation = arena.orientation;
}

export default ArenaDialogController;
