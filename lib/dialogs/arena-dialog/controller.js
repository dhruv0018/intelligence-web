ArenaDialogController.$inject = [
    '$scope',
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'ARENA_REGIONS_BY_ID'
];

function ArenaDialogController(
    $scope,
    ARENA_TYPES,
    games,
    teams,
    leagues,
    ARENA_REGIONS_BY_ID
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
    $scope.selectedValue = {
        region: {},
        coordinates: {
            x: undefined,
            y: undefined
        },
        regionId: null
    };

    $scope.onBlur = () => {
        console.log('on blur son');
    };


    $scope.$watch('selectedValue', (value) => {
        value.regionId = value.region.id;
        $scope.field.currentValue = value;
        value.name = angular.copy(ARENA_REGIONS_BY_ID[value.region.id].name);
    }, true);
}

export default ArenaDialogController;
