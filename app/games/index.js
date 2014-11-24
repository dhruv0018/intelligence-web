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
            }
        };

        $stateProvider.state(shortGames);
        $stateProvider.state(Games);
    }
]);

Games.controller('Games.controller', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($scope, $state, $stateParams, games, teams, users) {
        $scope.$watch('$scope.game', function() {
            $state.go('Games.RawFilm');
            //$state.go('Games.Breakdown');
        });
    }
]);

