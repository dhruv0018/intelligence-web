const angular = window.angular;

ArenaChartFiltersController.$inject = [
    '$scope',
    '$element',
    '$attrs',
    'SPORT_IDS',
    'EVENT',
    'EventEmitter',
    'PositionsetsFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'SessionService',
    'CustomtagsFactory',
    'GamesFactory',
    'PlayersFactory',
    '$stateParams',
    '$timeout'
];

function ArenaChartFiltersController (
    $scope,
    $element,
    $attrs,
    SPORT_IDS,
    EVENT,
    eventEmitter,
    positionsets,
    leagues,
    teams,
    session,
    customtags,
    games,
    players,
    $stateParams,
    $timeout
){
    const gameId = Number($stateParams.id);
    const game = games.get(gameId);
    const team = teams.get(game.teamId);
    const opposingTeam = teams.get(game.opposingTeamId);
    const league = leagues.get(team.leagueId);
    const positionset = positionsets.get(league.positionSetId);
    const teamPlayers = game.getTeamPlayers();
    const opposingTeamPlayers = game.getOpposingTeamPlayers();
    const teamRoster = game.getRoster(game.teamId);
    const opposingTeamRoster = game.getRoster(game.opposingTeamId);
    const customTags = customtags.getList({teamId: game.uploaderTeamId});

    $scope.game = game;
    $scope.team = team;
    $scope.opposingTeam = opposingTeam;
    $scope.league = league;
    $scope.SPORT_IDS = SPORT_IDS;

    // Initializes empty array of size 'numberOfPeriods' and maps indices to periods increased by one.
    $scope.periods = Array.apply(null, new Array(league.numberOfPeriods)).map((item, index) => index + 1);

    $scope.customTagLabels = transformTags(customTags);

    $scope.$on('self-edited-tags-applied', (event, tags) => {
        $timeout(()=>{
            customtags.load({teamId: game.uploaderTeamId}).then(
                (data)=>{
                    $scope.customTagLabels = transformTags(data);
                }
            );
        }, 1000);
    });

    $scope.teamPlayerLabels = getSortedPlayerLabels(teamPlayers, teamRoster);
    $scope.opposingTeamPlayerLabels = getSortedPlayerLabels(opposingTeamPlayers, opposingTeamRoster);

    function transformTags (tags){
        return tags.map((customTag) => {
            return {
                id: customTag.id,
                label: customTag.name
            };
        });
    }

    function getSortedPlayerLabels(playerList, roster) {
        return players
            .sortPlayerList(playerList, roster)
            .map(player => getPlayerLabel(player, roster));
    }

    /* Gets the standard player label with the addition of the
     * player's positionNames
     */
    function getPlayerLabel(player, roster) {
        const PAD_LENGTH = 0;
        let playerTitle = player.getPlayerTitle(roster, PAD_LENGTH);
        let positionNames = positionset.getPlayerPositionNames(roster, player.id);

        let label = playerTitle;
        label += positionNames.length ? ' ' + positionNames : '';

        return {
            id: player.id,
            label: label
        };
    }

    /* Shot Chart Filter Defaults */

    const filterModelDefault = {
        teamPlayersIds: [],
        opposingTeamPlayersIds: [],
        teamId: game.teamId,
        opposingTeamId: game.opposingTeamId,
        customTagIds: [],
        shots: {
            made: true,
            missed: true,
            blocked: true,
            saved: true
        },
        allPeriods: true,
        periods: {
            OT: false
        }
    };

    for (let i = 0; i < league.numberOfPeriods; i++) {
        filterModelDefault.periods[i + 1] = false;
    }

    $scope.filterModel = angular.copy(filterModelDefault);

    /* Watches */
    const DEEP_WATCH = true;

    $scope.$on('$destroy', onDestroy);

    $scope.$watch(() => $scope.filterModel, handleFilterUpdate, DEEP_WATCH);

    eventEmitter.on(EVENT.ARENA_CHART.FILTERS.RESET, onResetFilters);

    function handleFilterUpdate() {
        const hasActiveFilters = !angular.equals($scope.filterModel, filterModelDefault);

        eventEmitter.emit(EVENT.ARENA_CHART.FILTERS.UPDATE, hasActiveFilters);
    }

    function onResetFilters() {

        $scope.filterModel = angular.copy(filterModelDefault);
    }

    function onDestroy() {

        eventEmitter.removeListener(EVENT.ARENA_CHART.FILTERS.RESET, onResetFilters);
    }
}

export default ArenaChartFiltersController;
