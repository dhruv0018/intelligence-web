/* Fetch angular from the browser scope */
var angular = window.angular;


var rawFilm = require('raw-film');
var breakDown = require('breakdown');


/**
 * Coach game area raw film page module.
 * @module Games
 */
var Games = angular.module('Games', [
    'Games.RawFilm',
    'Games.Breakdown'
]);

Games.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('games/template.html', require('./template.html'));
    }
]);

Games.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var shortGames = {
            name: 'ShortGames',
            url: '/g/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function($state, $stateParams) {
                    var gameId = parseInt($stateParams.id, 36);
                    $state.go('Games', {id: gameId});
                }
            ]
        };
        var Games = {
            name: 'Games',
            url: '/games/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'games/template.html',
                    controller: 'Games.controller'
                }
            },
            resolve: {
                'Games.Data': [
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory', 'LeaguesFactory',
                    function($q, $stateParams, games, teams, users, leagues) {
                        var gameId = Number($stateParams.id);
                        return games.load(gameId).then(function() {
                            var game = games.get(gameId);

                            var Data = {
                                user: users.load(game.uploaderUserId),
                                team: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId])
                            };

                            //todo -- deal with this, real slow because of nesting
                            Data.league = Data.team.then(function() {
                                var uploaderTeam = teams.get(game.uploaderTeamId);
                                return leagues.fetch(uploaderTeam.leagueId);
                            });

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(shortGames);
        $stateProvider.state(Games);
    }
]);

Games.controller('Games.controller', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'UsersFactory', 'SPORTS', 'SessionService',
    function controller($scope, $state, $stateParams, games, teams, leagues, users, SPORTS, session) {
        $scope.game = games.get($stateParams.id);
        $scope.uploaderTeam = teams.get($scope.game.uploaderTeamId);
        $scope.league = leagues.get($scope.uploaderTeam.leagueId);

        //define states for view selector
        $scope.gameStates = [];

        if ($scope.game.isVideoTranscodeComplete() && $scope.game.isDelivered() && !$scope.game.isSharedWithUser(session.currentUser)) {
            $scope.gameStates.push(
                {
                    name: 'Raw Film',
                    state: 'Games.RawFilm'
                },
                {
                    name: 'Film Breakdown',
                    state: 'Games.Breakdown'
                }
            );

            if ($scope.league.sportId == SPORTS.BASKETBALL.id) {
                $scope.gameStates.push(
                    {
                        name: 'Shot Chart',
                        state: 'ga-shot-chart'
                    }
                );
            }

            if ($scope.league.sportId == SPORTS.FOOTBALL.id) {
                $scope.gameStates.push(
                    {
                        name: 'Formation Report',
                        state: 'ga-formations'
                    },
                    {
                        name: 'Down and Distance Report',
                        state: 'ga-down-distance'
                    }
                );
            }

            if ($scope.league.sportId == SPORTS.VOLLEYBALL.id || $scope.league.sportId == SPORTS.FOOTBALL.id) {
                $scope.gameStates.push(
                    {
                        name: 'Statistics',
                        state: 'ga-statistics'
                    }
                );
            }

        } else if ($scope.game.isVideoTranscodeComplete() && !$scope.game.isDelivered() || $scope.game.isSharedWithUser(session.currentUser)) {
            $scope.gameStates.push(
                {
                    name: 'Raw Film',
                    state: 'Coach.GameArea.RawFilm'
                }
            );
        }

        if (!$scope.game.isSharedWithUser(session.currentUser)) {
            $scope.gameStates.push(
                {
                    name: 'Game Information',
                    state: 'ga-info'
                }
            );
        }

        $scope.$watch('$scope.game', function(game) {
            $state.go('Games.RawFilm');
            //$state.go('Games.Breakdown');
        });
    }
]);

