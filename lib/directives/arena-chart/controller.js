
ArenaChartController.$inject = [
    'EventEmitter',
    'EVENT',
    'ARENA_TYPES',
    'PositionsetsFactory',
    'CustomtagsFactory',
    'PlayersFactory',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'SessionService',
    '$stateParams',
    '$filter',
    '$element',
    '$scope'
];

function ArenaChartController(
    eventEmitter,
    EVENT,
    ARENA_TYPES,
    positionsets,
    customtags,
    players,
    games,
    teams,
    leagues,
    session,
    $stateParams,
    $filter,
    $element,
    $scope
) {

    const gameId = Number($stateParams.id);
    const game = games.get(gameId);
    const team = teams.get(game.teamId);
    const opposingTeam = teams.get(game.opposingTeamId);
    const league = leagues.get(team.leagueId);
    const arenaEvents = game.getArenaEvents();
    const currentTeamId = session.getCurrentTeamId();
    const customTags = customtags.getList({teamId: currentTeamId});
    const opposingTeamPlayers = game.getOpposingTeamPlayers();
    const teamPlayers = game.getTeamPlayers();
    const teamRoster = game.getRoster(game.teamId);
    const opposingTeamRoster = game.getRoster(game.opposingTeamId);

    // Determine arena type
    this.arenaType = ARENA_TYPES[league.arenaId].type;
    this.arenaEvents = arenaEvents;

    /* Construct pills */

    const pills = [];

    teamPlayers.forEach((player) => {
        const playerLabel = player.getPlayerTitle(teamRoster);
        pills.push({
            id: player.id,
            name: playerLabel
        });
    });

    opposingTeamPlayers.forEach((player) => {
        const playerLabel = player.getPlayerTitle(opposingTeamRoster);
        pills.push({
            id: player.id,
            name: playerLabel
        });
    });

    customTags.forEach((tag) => {
        pills.push(tag);
    });

    /* reset filters */
    this.resetFilters = () => eventEmitter.emit(EVENT.ARENA_CHART.FILTERS.RESET);

    this.fullscreen = () => {

        if (!document.fullscreenEnabled) $element[0].requestFullscreen();
        else document.exitFullscreen();
    };

    this.fullscreenEnabled = false;

    this.onFullscreenChange = (event) => {

        if (document.fullscreenEnabled) this.fullscreenEnabled = true;
        else this.fullscreenEnabled = false;
    };

    document.addEventListener('fullscreenchange', this.onFullscreenChange);

    this.pillRemoved = (pill) => {

        if (!pill) return;

        let index;
        let filters = this.filters;
        let teamPlayersIds = filters.teamPlayersIds;
        let opposingTeamPlayersIds = filters.opposingTeamPlayersIds;
        let customTagIds = filters.customTagIds;

        index = teamPlayersIds.indexOf(pill.id);
        if (index !== -1) {
            teamPlayersIds.splice(index, 1);
            return;
        }

        index = opposingTeamPlayersIds.indexOf(pill.id);
        if (index !== -1) {
            opposingTeamPlayersIds.splice(index, 1);
            return;
        }

        index = customTagIds.indexOf(pill.id);
        if (index !== -1) {
            customTagIds.splice(index, 1);
            return;
        }
    };

    const DEEP_WATCH = true;

    const filtersWatch = (newFilters) => {

        if (!newFilters) return;

        /* Filter out active pills */
        this.activePills = pills.filter(getActivePills);

        function getActivePills(pill) {

            let isActive = newFilters.teamPlayersIds.some(playerId => playerId === pill.id);
            if (isActive) return true;

            isActive = newFilters.opposingTeamPlayersIds.some(playerId => playerId === pill.id);
            if (isActive) return true;

            isActive = newFilters.customTagIds.some(tagId => tagId === pill.id);
            if (isActive) return true;

            return false;
        }
    };

    $scope.$watch(() => this.filters, filtersWatch, DEEP_WATCH);

    this.onDestroy = () => {

        document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    };

    $scope.$on('$destroy', this.onDestroy);

}

export default ArenaChartController;
