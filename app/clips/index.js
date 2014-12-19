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
            url: '/c/:id?reel',
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
            url: '/clips/:id?reel',
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

                                var playersPromise = players.load({ gameId: gameId });

                                var teamsPromise = teams.load([game.teamId, game.opposingTeamId]).then(function() {

                                    var team = teams.get(game.teamId);

                                    return leagues.load(team.leagueId).then(function() {

                                        var league = leagues.get(team.leagueId);

                                        return tagsets.load(league.tagSetId);
                                    });
                                });

                                return $q.all([playersPromise, teamsPromise]);
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
    '$scope', '$state', '$stateParams', 'GamesFactory', 'ReelsFactory', 'TeamsFactory', 'PlaysFactory', 'LeaguesFactory', 'PlayersFactory', 'PlayManager', 'PlaysManager',
    function controller($scope, $state, $stateParams, games, reels, teams, plays, leagues, players, playManager, playsManager) {

        var playId = $stateParams.id;
        $scope.play = plays.get(playId);
        $scope.plays = [$scope.play];

        // Film Header data-attributes
        $scope.publiclyShared = true;
        $scope.game = games.get($scope.play.gameId);
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

        // Krossover Playlist data-attributes
        $scope.league = leagues.get($scope.team.leagueId);
        $scope.teamPlayers = $scope.game.getTeamPlayers();
        $scope.opposingTeamPlayers = $scope.game.getOpposingTeamPlayers();
        $scope.showHeader = false;
        $scope.showFooter = false;

        // Krossover VideoPlayer data-attributes
        $scope.sources = $scope.play.getVideoSources();
        $scope.videoTitle = 'clip';

        // TODO: This should be refactored, code-smell...
        playManager.videoTitle = 'reelsPlayer';

        /* Logic for clips navigation */
        $scope.reelId = $stateParams.reel;
        var reel = reels.get($scope.reelId);

        var reelPlays = [];
        for (var i = 0; i < reel.plays.length; i++) {
            var play = plays.get(reel.plays[i]);
            reelPlays.push(play);
        }

        playsManager.reset(reelPlays);

        $scope.reelName = reel.name;
        $scope.clipIndex = playsManager.getIndex($scope.play) + 1;
        $scope.clipTotal = reel.plays.length;
        $scope.previousPlay = playsManager.getPreviousPlay($scope.play);
        $scope.nextPlay = playsManager.getNextPlay($scope.play);

        $scope.goToPlay = function(play) {
            if (play) {
                $state.go('Clips', {id: play.id, reel: $scope.reelId});
            }
        };
    }
]);

