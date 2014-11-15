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
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory', 'PlaysFactory', 'PlayersFactory',
                    function($q, $stateParams, games, teams, users, plays) {

                        var playId = Number($stateParams.id);

                        return plays.load(playId).then(function() {

                            var play = plays.get(playId);
                            var gameId = play.gameId;

                            return games.load(gameId).then(function() {

                                var game = games.get(gameId);

                                return teams.load([game.teamId, game.opposingTeamId]);
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
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory', 'PlaysFactory',
    function controller($scope, $state, $stateParams, games, teams, plays) {
        var playId = $stateParams.id;
        $scope.play = plays.get(playId);
        $scope.game = games.get($scope.play.gameId);

        $scope.publiclyShared = false;

        if (!$scope.publiclyShared) { // Temp hack
            $scope.publiclyShared = true;
            $scope.team = teams.get($scope.game.teamId);
            $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

            $scope.sources = $scope.play.getVideoSources();
            $scope.filmTitle = $scope.play.description;
        }
    }
]);

