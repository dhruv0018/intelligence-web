const Mousetrap = window.Mousetrap;
const angular = window.angular;

ArenaPopupController.$inject = [
    '$scope',
    'field',
    '$uibModalInstance',
    'ARENA_TYPES',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'ARENA_REGIONS_BY_ID',
    'UIEventEmitter',
    'EVENT'
];

//TODO refactor much of this controller when the arena value is available
/*
* ArenaPopup Controller
* @module ArenaPopup
* @name ArenaPopup.Controller
* @type {Controller}
*/
function ArenaPopupController(
    $scope,
    field,
    $uibModalInstance,
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
    $scope.game = game;

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

            value.name = region.name;
        }
    }

    function onEnter () {
        //TODO use arena value class when it is available
        const displayValue = $scope.displayValue;
        let region = displayValue.region.id;
        let coordinates = {
            x: displayValue.coordinates.x,
            y: displayValue.coordinates.y
        };
        let name = $scope.displayValue.name;
        let value = { region, coordinates, name};

        if (field.isValid(value)) {
            $uibModalInstance.close(value);
        }
    }

    function onDestroy () {

        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    }
}

export default ArenaPopupController;
