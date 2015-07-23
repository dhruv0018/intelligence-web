const Mousetrap = window.Mousetrap;

ArenaDialogController.$inject = [
    '$scope',
    'field',
    '$mdDialog',
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'ARENA_REGIONS_BY_ID',
    '$timeout'
];

function ArenaDialogController(
    $scope,
    field,
    dialog,
    ARENA_TYPES,
    games,
    teams,
    leagues,
    ARENA_REGIONS_BY_ID,
    $timeout
) {
    Mousetrap.bind('enter', () => {
        $timeout( () => {
            field.currentValue = $scope.selectedValue;
            dialog.hide($scope.selectedValue);
        });
    });

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
        value.name = angular.copy(ARENA_REGIONS_BY_ID[value.region.id].name);
    }, true);
}

export default ArenaDialogController;
