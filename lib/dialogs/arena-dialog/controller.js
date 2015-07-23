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
    let closeModalKey = 'enter';
    let game = games.get(field.gameId);
    let team = teams.get(game.teamId);
    let league = leagues.get(team.leagueId);
    $scope.arena = ARENA_TYPES[league.arenaId];

    $scope.selectedValue = {
        region: {
            id: undefined
        },
        coordinates: {
            x: undefined,
            y: undefined
        }
    };

    $scope.$watch('selectedValue', (value) => {
        let region = ARENA_REGIONS_BY_ID[value.region.id];
        if (region) value.name = angular.copy(region.name);
    }, true);

    Mousetrap.bind(closeModalKey, () => dialog.hide(angular.copy($scope.selectedValue)));
}

export default ArenaDialogController;
