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
                    '$q', 'Coach.FormationReport.Data',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

/**
 * Coach Formation Data service.
 * @module Game Area Formation
 * @type {service}
 */
GameAreaFormations.service('Coach.FormationReport.Data', [
    '$q', 'Coach.Data', 'Coach.Game.Data', 'PlaysFactory',
    function service($q, data, game, plays) {
        var Data = {
            data: data,
            plays: data.then(function(data) {
                var promisedPlays = $q.defer();
                plays.getList(data.game.id, function(plays) {
                    promisedPlays.resolve(plays);
                }, null, true);
                return promisedPlays.promise;
            })
        };

        return Data;
    }
]);

GameAreaFormations.controller('GameAreaFormationsController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'Coach.FormationReport.Data',
    function controller($scope, $state, $stateParams, games, data) {
        $scope.plays = data.plays;
        $scope.league = data.data.league;
        $scope.team = data.data.team;
        $scope.teams = data.data.teams;
        $scope.teamId = $scope.game.teamId;
        $scope.report = {};
        $scope.report[$scope.game.teamId] = [
            {
                backfieldFormation: 'I-Form',
                teStrength: 'Right',
                wrStrength: 'Right',
                snaps: '20'
            },
            {
                backfieldFormation: 'Shotgun',
                teStrength: 'Right',
                wrStrength: 'Right',
                snaps: '12'
            },
            {
                backfieldFormation: 'I-Form',
                teStrength: 'Right',
                wrStrength: 'Left',
                snaps: '2'
            },
            {
                backfieldFormation: 'Shotgun',
                teStrength: 'Left',
                wrStrength: 'Left',
                snaps: '7'
            }
        ];
        $scope.report[$scope.game.opposingTeamId] = [
            {
                backfieldFormation: 'I-Form',
                teStrength: 'Right',
                wrStrength: 'Left',
                snaps: '10'
            },
            {
                backfieldFormation: 'Shotgun',
                teStrength: 'Right',
                wrStrength: 'Right',
                snaps: '13'
            },
            {
                backfieldFormation: 'Pistol',
                teStrength: 'Left',
                wrStrength: 'Left',
                snaps: '8'
            },
            {
                backfieldFormation: 'I-Form',
                teStrength: 'Right',
                wrStrength: 'Right',
                snaps: '21'
            }
        ];
    }
]);

