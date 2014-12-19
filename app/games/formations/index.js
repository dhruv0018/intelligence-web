/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesFormations = angular.module('Games.Formations', []);

GamesFormations.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/formations.html', require('./template.html'));
    }
]);

GamesFormations.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
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
                    '$q', '$stateParams', 'UsersFactory', 'TeamsFactory', 'FiltersetsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'LeaguesFactory',
                    function($q, $stateParams, users, teams, filtersets, games, players, plays, leagues) {

                        var gameId = Number($stateParams.id);
                        return games.load(gameId).then(function() {

                            var game = games.get(gameId);

                            var Data = {
                                user: users.load(game.uploaderUserId),
                                team: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId])
                            };

                            var teamPlayersFilter = { rosterId: game.getRoster(game.teamId).id };
                            Data.loadTeamPlayers = players.load(teamPlayersFilter);

                            var opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
                            Data.loadOpposingTeamPlayers = players.load(opposingTeamPlayersFilter);

                            var playsFilter = { gameId: game.id };
                            Data.loadPlays = plays.load(playsFilter);

                            //todo -- deal with this, real slow because of nesting
                            Data.league = Data.team.then(function() {
                                var uploaderTeam = teams.get(game.uploaderTeamId);
                                return leagues.fetch(uploaderTeam.leagueId);
                            });

                            Data.filterSet = Data.league.then(function() {
                                var uploaderTeam = teams.get(game.uploaderTeamId);
                                var uploaderLeague = leagues.get(uploaderTeam.leagueId);
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
    '$scope', '$state', '$stateParams', 'TeamsFactory', 'GamesFactory', 'Games.FormationReport.Data',
    function controller($scope, $state, $stateParams, teams, games, data) {

        $scope.plays = data.plays;
        $scope.league = data.league;
        $scope.teams = teams.getCollection();
        $scope.teamId = $scope.game.teamId;
        $scope.opposingTeamId = $scope.game.opposingTeamId;
        $scope.teamPlayers = data.teamPlayers;
        $scope.opposingTeamPlayers = data.opposingTeamPlayers;
        $scope.report = data.formationReport;

        $scope.myTeam = 'true';
        $scope.$watch('myTeam', function(myTeam) {
            if ($scope.myTeam == 'true') {
                $scope.teamId = $scope.game.teamId;
                $scope.opposingTeamId = $scope.game.opposingTeamId;
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

