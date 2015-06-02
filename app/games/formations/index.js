/* Fetch angular from the browser scope */
const angular = window.angular;

const GamesFormations = angular.module('Games.Formations', []);

GamesFormations.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/formations.html', require('./template.html'));
    }
]);

GamesFormations.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const gameArea = {
            name: 'Games.Formations',
            url: '/formations',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/formations.html',
                    controller: 'GamesFormations.controller'
                }
            },
            resolve: {
                'Games.FormationReport.Data': [
                    '$q',
                    '$stateParams',
                    'UsersFactory',
                    'TeamsFactory',
                    'FiltersetsFactory',
                    'GamesFactory',
                    'PlayersFactory',
                    'PlaysFactory',
                    'LeaguesFactory',
                    function(
                        $q,
                        $stateParams,
                        users,
                        teams,
                        filtersets,
                        games,
                        players,
                        plays,
                        leagues
                    ) {

                        let gameId = Number($stateParams.id);
                        return games.load(gameId).then(function() {

                            let game = games.get(gameId);

                            let Data = {
                                user: users.load(game.uploaderUserId),
                                team: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId])
                            };

                            let teamPlayersFilter = { rosterId: game.getRoster(game.teamId).id };
                            Data.loadTeamPlayers = players.load(teamPlayersFilter);

                            let opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
                            Data.loadOpposingTeamPlayers = players.load(opposingTeamPlayersFilter);

                            let playsFilter = { gameId: game.id };
                            Data.loadPlays = plays.load(playsFilter);

                            //todo -- deal with this, real slow because of nesting
                            Data.league = Data.team.then(function() {
                                let uploaderTeam = teams.get(game.uploaderTeamId);
                                return leagues.fetch(uploaderTeam.leagueId);
                            });

                            Data.filterSet = Data.league.then(function() {
                                let uploaderTeam = teams.get(game.uploaderTeamId);
                                let uploaderLeague = leagues.get(uploaderTeam.leagueId);
                                return filtersets.fetch(uploaderLeague.filterSetId);
                            });

                            Data.formationReport = game.getFormationReport().$promise.then(function(formationReport) {
                                return formationReport;
                            });

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GamesFormations.controller('GamesFormations.controller', [
    '$scope',
    '$state',
    '$stateParams',
    'TeamsFactory',
    'GamesFactory',
    'LeaguesFactory',
    'PlaysFactory',
    'PlayersFactory',
    'CustomtagsFactory',
    'PlaylistEventEmitter',
    'Games.FormationReport.Data',
    'ARENA_TYPES',
    'ZONE_IDS',
    'GAP_IDS',
    'CUSTOM_TAGS_EVENTS',
    function controller(
        $scope,
        $state,
        $stateParams,
        teams,
        games,
        leagues,
        plays,
        players,
        customtags,
        playlistEventEmitter,
        data,
        ARENA_TYPES,
        ZONE_IDS,
        GAP_IDS,
        CUSTOM_TAGS_EVENTS
    ) {

        let formationReport = angular.copy(data.formationReport);
        $scope.report = formationReport;

        //Game Related
        let gameId = $stateParams.id;
        $scope.game = games.get(gameId);

        //Team Related
        $scope.teams = teams.getCollection();
        $scope.team = teams.get($scope.game.teamId);
        $scope.teamId = $scope.game.teamId;
        $scope.opposingTeamId = $scope.game.opposingTeamId;

        //League Related
        let league = leagues.get($scope.team.leagueId);
        $scope.league = league;

        //Custom Tags Related
        $scope.customtags = customtags.getList();
        $scope.customTagIds = [];

        playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, event => {
            $scope.customtags = customtags.getList();
        });

        //Plays Related
        $scope.allPlays = plays.getList({ gameId: $scope.game.id });

        $scope.$watch('customTagIds', () => {
            //Filter plays by custom tag ids
            $scope.plays = plays.filterByCustomTags($scope.allPlays, $scope.customTagIds);
            let playIds = $scope.plays.map(play => play.id);

            //Make new copy of formation report before filtering
            formationReport = angular.copy(data.formationReport);

            formationReport[$scope.teamId].forEach(chart => {
                let snaps = 0;

                //For some reason this becomes an array when empty
                if (chart.passes && !Array.isArray(chart.passes)) {
                    Object.keys(ZONE_IDS).forEach(zoneId => {
                        let passes = chart.passes[zoneId];

                        if (passes) {
                            //Filter passes by new list of plays
                            chart.passes[zoneId].playIds = passes.playIds.filter(playId => {
                                return !!~playIds.indexOf(playId);
                            });

                            //Update total number of passes for this zone based on filtered plays
                            chart.passes[zoneId].totalPassCount = chart.passes[zoneId].playIds.length;
                            snaps += chart.passes[zoneId].totalPassCount;
                        }
                    });
                }

                //For some reason this becomes an array when empty
                if (chart.runs && !Array.isArray(chart.runs)) {
                    Object.keys(GAP_IDS).forEach(gapId => {
                        let runs = chart.runs[gapId];

                        if (runs) {
                            //Filter runs by new list of plays
                            chart.runs[gapId].playIds = runs.playIds.filter(playId => {
                                return !!~playIds.indexOf(playId);
                            });

                            //Update total number of runs for this gap based on filtered plays
                            chart.runs[gapId].totalRuns = chart.runs[gapId].playIds.length;
                            snaps += chart.runs[gapId].totalRuns;
                        }
                    });
                }

                //Update snap count based on filtered plays
                chart.snaps = snaps;
            });

            formationReport[$scope.teamId] = formationReport[$scope.teamId].filter(chart => chart.snaps);
            $scope.report = formationReport;
        });

        // Determine arena type
        $scope.arenaType = ARENA_TYPES[league.arenaId].type;

        //TODO get rid of the previous code and use this code instead once caching is in
        //$scope.game.getFormationReport().$promise.then(function(formationReport) {
        //    $scope.report = formationReport;
        //});

        //todo strange string representation of a boolean
        $scope.myTeam = 'true';

        //todo seems like a candidate for removal
        $scope.$watch('myTeam', function(myTeam) {
            //TODO use of implicit casting is risky IMO
            if ($scope.myTeam == 'true') {
                $scope.teamId = $scope.game.teamId;
                $scope.opposingTeamId = $scope.game.opposingTeamId;
            //todo also implicit casting
            } else if ($scope.myTeam == 'false') {
                $scope.teamId = $scope.game.opposingTeamId;
                $scope.opposingTeamId = $scope.game.teamId;
            }
        });

        $scope.redzone = 'false';
        $scope.$watch('redzone', function(redzone) {
            $scope.isRedZone = $scope.redzone === 'true';
        });
    }
]);
