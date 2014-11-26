/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Formation Report page module.
 * @module GameArea
 */
var GamesDownAndDistance = angular.module('Games.DownAndDistance', [
    'ui.router',
    'ui.bootstrap'
]);

GamesDownAndDistance.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/games/downDistance.html', require('./template.html'));
    }
]);

GamesDownAndDistance.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'Games.DownAndDistance',
            url: '/down-and-distance',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'coach/games/downDistance.html',
                    controller: 'GamesDownAndDistanceController'
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

                            //todo not 100% sure this belongs here -- doesn't seem right -- transporting anyway
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

GamesDownAndDistance.controller('GamesDownAndDistanceController', [
    '$scope', '$state', '$stateParams', 'TeamsFactory', 'GamesFactory', 'Games.DownAndDistance.Data',
    function controller($scope, $state, $stateParams, teams, games, data) {
        var teamOnOffense = true;

        //var gameId = Number($stateParams.id);
        $scope.game = data.game;
        $scope.plays = data.plays;
        $scope.league = data.league;
        $scope.teams = teams.getCollection();
        $scope.teamId = $scope.game.teamId;
        $scope.opposingTeamId = $scope.game.opposingTeamId;
        $scope.report = data.formationReport;

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

        $scope.dndReport = {
            gameId: $scope.game.id,
            teamId: $scope.teamId,
            distance: $scope.options.distance[0],
            strength: $scope.options.weight[0],
            redZone: false,
            hash: $scope.options.hash[0],
            down: $scope.options.down[0]
        };

        $scope.createDownAndDistanceReport = function() {

            if ($scope.dndReport.redZone === 'true') {
                $scope.dndReport.redZone = true;
            } else {
                $scope.dndReport.redZone = false;
            }

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

