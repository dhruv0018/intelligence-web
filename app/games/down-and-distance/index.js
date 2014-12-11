/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesDownAndDistance = angular.module('Games.DownAndDistance', []);

GamesDownAndDistance.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/downDistance.html', require('./template.html'));
    }
]);

GamesDownAndDistance.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var dnd = {
            name: 'Games.DownAndDistance',
            url: '/down-and-distance',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/downDistance.html',
                    controller: 'GamesDownAndDistance.controller'
                }
            },
            resolve: {
                'Games.DownAndDistance.Data': [
                    '$q', '$stateParams', 'UsersFactory', 'TeamsFactory', 'FiltersetsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'LeaguesFactory',
                    function($q, $stateParams, users, teams, filtersets, games, players, plays, leagues) {

                        var gameId = Number($stateParams.id);
                        return games.load(gameId).then(function() {

                            var game = games.get(gameId);

                            var Data = {
                                user: users.load(game.uploaderUserId),
                                team: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId]),
                                game: game
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

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(dnd);

    }
]);

GamesDownAndDistance.controller('GamesDownAndDistance.controller', [
    '$stateParams', '$scope', 'TeamsFactory', 'GamesFactory', 'PlaysFactory', 'LeaguesFactory', 'Games.DownAndDistance.Data',
    function controller($stateParams, $scope, teams, games, plays,  leagues, data) {

        //Collections
        $scope.teams = teams.getCollection();

        //Game Related
        var gameId = $stateParams.id;
        $scope.game = games.get(gameId);

        //Team Related
        $scope.teamId = $scope.game.teamId;
        $scope.opposingTeamId = $scope.game.opposingTeamId;
        var team = teams.get($scope.teamId);

        //Play Related
        var playsFilter = { gameId: gameId };
        $scope.plays = plays.getList(playsFilter);

        //League Related
        $scope.league = leagues.get(team.leagueId);

        var teamOnOffense = true;

        //Used to render the view for the
        $scope.options = {
            'distance': {
                'Any': undefined,
                'Short': 'short',
                'Medium': 'medium',
                'Long': 'long'
            },
            'weight': {
                'Any': undefined,
                'Left': 'Left',
                'Right': 'Right',
                'Balanced': 'Balanced'
            },
            'down': {
                'Any': undefined,
                '1st': '1st',
                '2nd': '2nd',
                '3rd': '3rd',
                '4th': '4th'
            },
            'hash': {
                'Any': undefined,
                'Left': 'Left',
                'Right': 'Right',
                'Middle': 'Middle'
            }
        };

        //Default Report request
        $scope.dndReport = {
            gameId: $scope.game.id,
            teamId: $scope.teamId,
            distance: $scope.options.distance[0],
            strength: $scope.options.weight[0],
            redZone: false,
            hash: $scope.options.hash[0],
            down: $scope.options.down[0]
        };


        //Generates a down and distant report based on various properties stored on the dndReport object
        $scope.createDownAndDistanceReport = function() {

            //TODO This casting seems very awkward -- perhaps the generation method should handle the casting
            if ($scope.dndReport.redZone === 'true') {
                $scope.dndReport.redZone = true;
            } else {
                $scope.dndReport.redZone = false;
            }

            //TODO this doesn't seem to be doing anything at all, it is basically setting the variable back to itself
            if ($scope.dndReport.teamId == $scope.teamId) {
                $scope.dndReport.teamId = $scope.teamId;
            } else if ($scope.dndReport.teamId == $scope.opposingTeamId) {
                $scope.dndReport.teamId = $scope.opposingTeamId;
            }

            games.getDownAndDistanceReport($scope.dndReport).then(function(dndReport) {
                $scope.game.dndReport = dndReport;
            });

        };
    }
]);

