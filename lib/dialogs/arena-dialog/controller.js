ArenaDialogController.$inject = [
    '$scope',
    'field',
    '$mdDialog',
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'ARENA_REGIONS_BY_ID'
];

function ArenaDialogController(
    $scope,
    field,
    dialog,
    ARENA_TYPES,
    games,
    teams,
    leagues,
    ARENA_REGIONS_BY_ID
) {
    console.log(field);
    let game = games.get(field.gameId);
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


    $scope.$watch('selectedValue', (value) => {
        value.regionId = value.region.id;
        field.currentValue = value;
        value.name = angular.copy(ARENA_REGIONS_BY_ID[value.region.id].name);
        dialog.hide(value);
    }, true);
}

export default ArenaDialogController;
