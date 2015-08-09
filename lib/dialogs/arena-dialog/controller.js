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
    'UIEventEmitter',
    'EVENT'
];

function ArenaDialogController(
    $scope,
    field,
    $mdDialog,
    ARENA_TYPES,
    games,
    teams,
    leagues,
    ARENA_REGIONS_BY_ID,
    uiEventEmitter,
    EVENT
) {

    const game = games.get(field.gameId);
    const team = teams.get(game.teamId);
    const league = leagues.get(team.leagueId);

    $scope.arena = ARENA_TYPES[league.arenaId];
    initializeValue();
    $scope.$watch('displayValue', onValueChange, true);
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    $scope.$on('$destroy', onDestroy);

    function initializeValue () {

        $scope.displayValue = {
            region: {
                id: field.value.region
            },
            coordinates: {
                x: field.value.coordinates.x,
                y: field.value.coordinates.y
            }
        };
    }

    function onValueChange (value) {

        const region = ARENA_REGIONS_BY_ID[value.region.id];

        if (region) {

            value.name = angular.copy(region.name);
        }
    }

    function onEnter () {

        let value = angular.copy($scope.displayValue);
        value.region = value.region.id;

        /**
         * FIXME:
         * We should not be passing the value back through $mdDialog
         * Although the documentation contradicts me, I have run into
         * issues if you do not pass back the original promise reference
         * to $mdDialog.hide. I'm not sure what $mdDialog is expecting
         * currently, but this value is returned as a parameter in the
         * promise callback
         */
        if (field.isValid(value)) {

            $mdDialog.hide(value);
        }
    }

    function onDestroy () {

        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    }
}

export default ArenaDialogController;
