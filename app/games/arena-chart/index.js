/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesArenaChart = angular.module('Games.ArenaChart', []);

GamesArenaChart.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/arena-chart.html', require('./template.html'));
    }
]);

GamesArenaChart.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var arenaChart = {
            name: 'Games.ArenaChart',
            url: '/arena-chart',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/arena-chart.html',
                    controller: 'GamesArenaChart.controller'
                }
            },
            resolve: {
                'Games.ArenaChart.Data': GamesArenaChartData
            }
        };

        $stateProvider.state(arenaChart);

    }
]);

/* ArenaChart Data Resolve */

GamesArenaChartData.$inject = [
    'PlayersFactory',
    'GamesFactory',
    '$stateParams',
    '$q'
];

function GamesArenaChartData (
    players,
    games,
    $stateParams,
    $q
) {

    let gameId = Number($stateParams.id);

    return games.load(gameId).then(function() {

        let game = games.get(gameId);

        let Data = {
            players: players.load({
                'rosterId[]': [
                    game.getRoster(game.teamId).id,
                    game.getRoster(game.opposingTeamId).id
                ]
            }),
            arenaEvents: game.getArenaEvents().$promise.then(function(arenaEvents) {
                return arenaEvents;
            })
        };

        return $q.all(Data);
    });
}


/* ArenaChart Controller */

GamesArenaChartController.$inject = [
    'Games.ArenaChart.Data',
    'ARENA_TYPES',
    'CustomtagsFactory',
    'PlayersFactory',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    '$stateParams',
    '$filter',
    '$scope'
];

function GamesArenaChartController(
    data,
    ARENA_TYPES,
    customTags,
    players,
    games,
    teams,
    leagues,
    $stateParams,
    $filter,
    $scope
) {

    let game = games.get($stateParams.id);
    let team = teams.get(game.teamId);
    let opposingTeam = teams.get(game.opposingTeamId);
    let league = leagues.get(team.leagueId);
    let arenaEvents = data.arenaEvents;
    let customtags = customTags.getList();

    let teamPlayersFilter = {rosterId: game.getRoster(game.teamId).id};
    let teamPlayerList = players.getList(teamPlayersFilter);

    let opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
    let opposingTeamPlayerList = players.getList(opposingTeamPlayersFilter);


    // Determine arena type
    try {
        $scope.arenaType = ARENA_TYPES[league.arenaId].type;
    } catch (error) {
        throw new Error(error);
    }

    $scope.arenaEvents = arenaEvents;
    $scope.filteredArenaEvents = [];

    /* Construct pills */

    let pills = [];

    teamPlayerList.forEach((player) => {
        let playerCopy = angular.copy(player);
        playerCopy.name = player.shortName;
        pills.push(playerCopy);
    });

    opposingTeamPlayerList.forEach((player) => {
        let playerCopy = angular.copy(player);
        playerCopy.name = player.shortName;
        pills.push(playerCopy);
    });

    customtags.forEach((tag) => {
        pills.push(tag);
    });

    $scope.pills = pills;

    // TODO: Add custom tags to pills

    /* reset filters */
    $scope.resetFilters = function() {

        $scope.$broadcast('arena-chart-filters:reset');
    };

    let removeFiltersWatch = $scope.$watch('filters', filtersWatch, true);
    let removeRemovedPillWatch = $scope.$watch('removedPill', removedPillWatch);
    $scope.$on('$destroy', onDestroy);

    /* Filter arenaEvents in this watch to have access to the filtered results in this scope */
    function filtersWatch(newFilters) {

        if (!newFilters) return;

        /* Filter arena events */
        $scope.filteredArenaEvents = $filter('arenaEvents')($scope.arenaEvents, newFilters);

        /* Setup Pills */
        // player names, // custom tag names
        $scope.pills = pills.filter((pill) => {

            /* Team Players */
            if (pill.model === 'PlayersResource') {

                let isTeamPlayer = newFilters.teamPlayersIds.some((playerId) => {
                    return pill.id === playerId;
                });

                if (isTeamPlayer) return isTeamPlayer;

                let isOpposingTeamPlayer = newFilters.opposingTeamPlayersIds.some((playerId) => {
                    return pill.id === playerId;
                });

                return isOpposingTeamPlayer;

            } else if (pill.model === 'CustomtagsResource') {

                let isCustomTag = newFilters.customTagIds.some((tagId) => {
                    return pill.id === tagId;
                });

                return isCustomTag;
            }
        });
    }

    function removedPillWatch(pill) {

        if (!pill) return;

        if (pill.model === 'PlayersResource') {

            let index = $scope.filters.teamPlayersIds.indexOf(pill.id);
            if (index != -1) $scope.filters.teamPlayersIds.splice(index, 1);

            index = $scope.filters.opposingTeamPlayersIds.indexOf(pill.id);
            if (index != -1) $scope.filters.opposingTeamPlayersIds.splice(index, 1);

        } else if (pill.model === 'CustomtagsResource') {

            index = $scope.filters.customTagIds.indexOf(pill.id);
            if (index != -1) $scope.filters.customTagIds.splice(index, 1);
        }

        $scope.removedPill = null;
    }

    function onDestroy() {

        removeFiltersWatch();
    }
}

GamesArenaChart.controller('GamesArenaChart.controller', GamesArenaChartController);
