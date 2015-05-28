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
    'PlayersFactory',
    'CustomtagsFactory',
    'Games.FormationReport.Data',
    'ARENA_TYPES',
    function controller(
        $scope,
        $state,
        $stateParams,
        teams,
        games,
        leagues,
        players,
        customtags,
        data,
        ARENA_TYPES
    ) {
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
        $scope.customtags = customtags.getList({ teamId: $scope.teamId });

        // Determine arena type
        $scope.arenaType = ARENA_TYPES[league.arenaId].type;

        //TODO formation report is a special case of data
        //This is going to go away relatively soon
        $scope.report = data.formationReport;

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
