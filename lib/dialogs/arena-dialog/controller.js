const Mousetrap = window.Mousetrap;

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
    let closeModalKey = 'enter';
    let initialValue = field.currentValue;

    let game = games.get(field.gameId);
    let team = teams.get(game.teamId);
    let league = leagues.get(team.leagueId);
    $scope.arena = ARENA_TYPES[league.arenaId];

    $scope.displayValue = {
        region: {
            id: initialValue.region
        },
        coordinates: {
            x: initialValue.coordinates.x,
            y: initialValue.coordinates.y
        }
    };

    $scope.$watch('displayValue', (value) => {
        let region = ARENA_REGIONS_BY_ID[value.region.id];
        if (region) value.name = angular.copy(region.name);
    }, true);

    Mousetrap.bind(closeModalKey, () => dialog.hide(angular.copy($scope.displayValue)));
}

export default ArenaDialogController;
