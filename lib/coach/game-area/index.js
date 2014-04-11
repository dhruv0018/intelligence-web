require('./gameAreaInformation.js');
require('./gameAreaFilm.js');


/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area page module.
 * @module GameArea
 */
var GameArea = angular.module('game-area', [
    'ui.router',
    'ui.bootstrap',
    'game-area-information',
    'game-area-film'
]);

/* Cache the template file */
GameArea.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/template.html', require('./template.html'));
    }
]);

/**
 * GameArea page state router.
 * @module AddFilm
 * @type {UI-Router}
 */
GameArea.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'game-area',
            url: '/game-area/:id',
            parent: 'Coach',
            views: {
                'main@root': {
                    templateUrl: 'coach/game-area/template.html',
                    controller: 'GameAreaController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameArea.value('GameAreaTabs', {
    'game-info':     { active: true, disabled: false },
    'your-team':     { active: false, disabled: false },
    'opposing-team': { active: false, disabled: false },
    'instructions':    { active: false, disabled: false }
});

/**
 * GameArea controller.
 * @module GameArea
 * @name GameAreaController
 * @type {Controller}
 */
GameArea.controller('GameAreaController', [
    '$scope', '$state', '$stateParams', '$localStorage', 'SessionService', 'TeamsFactory', 'GamesFactory', 'GAME_STATUS_IDS',
    function controller($scope, $state, $stateParams, $localStorage, session, teams, games, gameStatusIds) {
        $scope.gameId = $stateParams.id;

        $scope.$storage = $localStorage;

        games.get($scope.gameId, function(game) {
            $scope.$storage.gameStatus = gameStatusIds[game.status];

            $scope.$storage.game = games.formatInputData(game);
            var teamId = session.currentUser.currentRole.teamId;

            teams.get(teamId, function (team) {
                $scope.$storage.team = team;
                $scope.$storage.game.teamId = team.id;
                $scope.$storage.game.primaryJerseyColor = team.primaryJerseyColor;
                $scope.$storage.game.secondaryJerseyColor = team.secondaryJerseyColor;
                teams.get($scope.$storage.game.opposingTeamId, function (team) {
                    $scope.$storage.opposingTeam = team;
                });
            });

        }, function (failure) {
            //set up for handling game retrieval failures
        });

        //view selector
        $scope.dataType = 'video';

        $scope.$watch('dataType', function (data) {
            if ($scope.dataType === 'game-info') {
                $state.go('ga-info');
            } else if ($scope.dataType === 'video') {
                $state.go('ga-film');
            } else {
                $state.go('game-area');
            }
        });
    }
]);


