/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Formation Report page module.
 * @module GameArea
 */
var GameAreaFormations = angular.module('game-area-formations', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaFormations.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaFormations.html', require('./gameAreaFormations.html'));
    }
]);

GameAreaFormations.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-formations',
            url: '/formations',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaFormations.html',
                    controller: 'GameAreaFormationsController'
                }
            },
            resolve: {
                'Coach.FormationReport.Data': [
                    '$q', 'Coach.Data',
                    function($q, data) {
                        return data.game.getFormationReport().$promise.then(function(formationReport) {
                            data.formationReport = formationReport;
                            return data;
                        });
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaFormations.controller('GameAreaFormationsController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'Coach.FormationReport.Data',
    function controller($scope, $state, $stateParams, games, data) {

        $scope.plays = data.plays;
        $scope.league = data.league;
        $scope.teams = data.teams.getCollection();
        $scope.teamId = $scope.game.teamId;
        $scope.opposingTeamId = $scope.game.opposingTeamId;
        $scope.report = data.formationReport;

        console.log($scope.plays);

        $scope.redzone = 'false';
        $scope.$watch('redzone', function(redzone) {
            $scope.isRedZone = $scope.redzone === 'true';
        });
    }
]);

