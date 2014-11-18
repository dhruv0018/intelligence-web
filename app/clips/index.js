/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Public clips page module.
 * @module Clips
 */
var Clips = angular.module('Clips', [
    'ui.router',
    'ui.bootstrap'
]);

Clips.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('clips/template.html', require('./template.html'));
    }
]);

Clips.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var shortClips = {
            name: 'ShortClips',
            url: '/c/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function($state, $stateParams) {
                    var clipId = parseInt($stateParams.id, 36);
                    $state.go('Clips', {id: clipId});
                }
            ]
        };

        var Clips = {
            name: 'Clips',
            url: '/clips/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'clips/template.html',
                    controller: 'Clips.controller'
                }
            },
            resolve: {
                'Clips.Data': [
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory', 'PlaysFactory', 'PlayersFactory', 'LeaguesFactory', 'TagsetsFactory',
                    function($q, $stateParams, games, teams, users, plays, players, leagues, tagsets) {

                        var playId = Number($stateParams.id);

                        return plays.load(playId).then(function() {

                            var play = plays.get(playId);
                            var gameId = play.gameId;

                            return games.load(gameId).then(function() {

                                var game = games.get(gameId);

                                var teamPlayersFilter = { rosterId: game.getRoster(game.teamId).id };
                                var loadTeamPlayers = players.load(teamPlayersFilter);

                                var opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
                                var loadOpposingTeamPlayers = players.load(opposingTeamPlayersFilter);

                                return teams.load([game.teamId, game.opposingTeamId]).then(function() {

                                    var team = teams.get(game.teamId);

                                    return leagues.load(team.leagueId).then(function() {

                                        var league = leagues.get(team.leagueId);

                                        return tagsets.load(league.tagSetId);
                                    });
                                });
                            });

                        });
                    }
                ]
            }
        };

        $stateProvider.state(shortClips);
        $stateProvider.state(Clips);
    }
]);

Clips.controller('Clips.controller', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory', 'PlaysFactory', 'LeaguesFactory', 'PlayersFactory',
    function controller($scope, $state, $stateParams, games, teams, plays, leagues, players) {

        $scope.publiclyShared = false;

        if (!$scope.publiclyShared) { // Temp hack

            var playId = $stateParams.id;
            $scope.play = plays.get(playId);

            // Film Header data-attributes
            $scope.publiclyShared = true;
            $scope.game = games.get($scope.play.gameId);
            $scope.team = teams.get($scope.game.teamId);
            $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

            // Krossover Play data-attributes
            $scope.league = leagues.get($scope.team.leagueId);
            var teamPlayersFilter = { rosterId: $scope.game.getRoster($scope.game.teamId).id };
            $scope.teamPlayers = players.getList(teamPlayersFilter);
            var opposingTeamPlayersFilter = { rosterId: $scope.game.getRoster($scope.game.opposingTeamId).id };
            $scope.opposingTeamPlayers = players.getList(opposingTeamPlayersFilter);

            // Krossover VideoPlayer data-attributes
            $scope.sources = $scope.play.getVideoSources();
            $scope.videoTitle = 'clip';
        }
    }
]);

