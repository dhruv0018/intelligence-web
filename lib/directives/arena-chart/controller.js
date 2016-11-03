
ArenaChartController.$inject = [
    'BreakdownDialog.Service',
    'EventEmitter',
    'EVENT',
    'ARENA_TYPES',
    'PositionsetsFactory',
    'CustomtagsFactory',
    'PlayersFactory',
    'PlaysFactory',
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
    breakdownDialog,
    eventEmitter,
    EVENT,
    ARENA_TYPES,
    positionsets,
    customtags,
    players,
    playsFactory,
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
        const PAD_LENGTH = 2;
        const playerLabel = player.getPlayerTitle(teamRoster, PAD_LENGTH);
        pills.push({
            id: player.id,
            name: playerLabel
        });
    });

    opposingTeamPlayers.forEach((player) => {
        const PAD_LENGTH = 2;
        const playerLabel = player.getPlayerTitle(opposingTeamRoster, PAD_LENGTH);
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

        if (!this.fullscreenEnabled) $element[0].requestFullscreen();
        else document.exitFullscreen();
    };

    // TO-DO: This is an un-elegant workaround to document.fullscreen having different syntax for webkit and firefox.
    // In the future, get the polyfill working so we can just check document.fullscreen above instead of having our own variable
    this.fullscreenEnabled = false;

    this.onFullscreenChange = (event) => {
        this.fullscreenEnabled = !this.fullscreenEnabled;
    };

    document.addEventListener('fullscreenchange', this.onFullscreenChange);

    this.onArenaEventClick = ($event, arenaEvent) => {

        let playIds = [arenaEvent.playId];
        this.openBreakdownModal($event, playIds);
    };

    this.openBreakdownModal = ($event, playIds) => {

        const parent = $element;

        const breakdownDialogPromise = breakdownDialog.show($event, parent, playIds);
    };

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

    /* Watches */
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

    const handleFilterUpdate = (hasActiveFilters) => {
        this.hasActiveFilters = hasActiveFilters;
    };

    $scope.$watch(() => this.filters, filtersWatch, DEEP_WATCH);

    eventEmitter.on(EVENT.ARENA_CHART.FILTERS.UPDATE, handleFilterUpdate);

    this.onDestroy = () => {
        eventEmitter.removeListener(EVENT.ARENA_CHART.FILTERS.UPDATE, handleFilterUpdate);
        document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    };

    $scope.$on('$destroy', this.onDestroy);

}

export default ArenaChartController;
