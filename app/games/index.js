/* Fetch angular from the browser scope */
var angular = window.angular;


require('raw-film');
require('breakdown');
require('down-and-distance');
require('game-info');
require('stats');
require('formations');
require('shot-chart');

/**
 * Coach game area raw film page module.
 * @module Games
 */
var Games = angular.module('Games', [
    'Games.RawFilm',
    'Games.Breakdown',
    'Games.DownAndDistance',
    'Games.Info',
    'Games.Stats',
    'Games.Formations',
    'Games.ShotChart'
]);

Games.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('games/template.html', require('./template.html'));
        $templateCache.put('games/restricted.html', require('./restricted.html'));
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

        var GamesRestricted = {
            name: 'Games.Restricted',
            url: 'games/:id/restricted',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'games/restricted.html'
                }
            }
        };

        var Games = {
            name: 'Games',
            url: '/games/:id',
            parent: 'base',
            onEnter: [
                '$state', 'Games.Data', 'SessionService', 'GamesFactory',
                function($state, data, session, games) {
                    var currentUser = session.currentUser;

                    var hasAccess = false;

                    if (data.game.isSharedWithPublic() || data.game.uploaderTeamId === currentUser.currentRole.teamId || games.isSharedWithUser(currentUser)) {
                        hasAccess = true;
                    } else {
                        $state.go('Games.Restricted', {id: data.game.id});
                    }
                }
            ],
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
                                team: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId]),
                                game: game
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
        $stateProvider.state(GamesRestricted);
        $stateProvider.state(Games);
    }
]);

Games.controller('Games.controller', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'UsersFactory', 'SPORTS', 'SessionService', 'ROLES',
    function controller($scope, $state, $stateParams, games, teams, leagues, users, SPORTS, session, ROLES) {
        $scope.game = games.get($stateParams.id);

        $scope.teams = teams.getCollection();
        $scope.team = $scope.teams[$scope.game.teamId];
        $scope.opposingTeam = $scope.teams[$scope.game.opposingTeamId];

        //todo alex -- remove this when it is not needed for header
        $scope.isPublic = true;

        $scope.uploaderTeam = teams.get($scope.game.uploaderTeamId);
        $scope.league = leagues.get($scope.uploaderTeam.leagueId);
        var currentUser = session.currentUser;

        //define states for view selector
        $scope.gameStates = [];

        if ($scope.game.isVideoTranscodeComplete() && $scope.game.isDelivered() && !$scope.game.isSharedWithUser(session.currentUser)) {
            $scope.gameStates.push(
                {
                    name: 'Film Breakdown',
                    state: 'Games.Breakdown'
                },
                {
                    name: 'Raw Film',
                    state: 'Games.RawFilm'
                }
            );

            if ($scope.league.sportId == SPORTS.BASKETBALL.id && currentUser.is(ROLES.COACH)) {
                $scope.gameStates.push(
                    {
                        name: 'Shot Chart',
                        state: 'Games.ShotChart'
                    }
                );
            }

            if ($scope.league.sportId == SPORTS.FOOTBALL.id && currentUser.is(ROLES.COACH)) {
                $scope.gameStates.push(
                    {
                        name: 'Formation Report',
                        state: 'Games.Formations'
                    },
                    {
                        name: 'Down and Distance Report',
                        state: 'Games.DownAndDistance'
                    }
                );
            }

            if (($scope.league.sportId == SPORTS.VOLLEYBALL.id || $scope.league.sportId == SPORTS.FOOTBALL.id) && currentUser.is(ROLES.COACH)) {
                $scope.gameStates.push(
                    {
                        name: 'Statistics',
                        state: 'Games.Stats'
                    }
                );
            }

        } else if ($scope.game.isVideoTranscodeComplete() && !$scope.game.isDelivered() || $scope.game.isSharedWithUser(session.currentUser)) {
            $scope.gameStates.push(
                {
                    name: 'Raw Film',
                    state: 'Games.RawFilm'
                }
            );
        }

        if (!$scope.game.isSharedWithUser(session.currentUser) && currentUser.is(ROLES.COACH)) {
            $scope.gameStates.push(
                {
                    name: 'Game Information',
                    state: 'Games.Info'
                }
            );
        }
    }
]);

