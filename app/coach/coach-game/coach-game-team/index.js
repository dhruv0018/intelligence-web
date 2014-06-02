/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module OpposingTeam
 */
var Team = angular.module('Coach.Game.Team', []);

/* Cache the template file */
Team.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Team directive.
 * @module Team
 * @name Team
 * @type {directive}
 */
Team.directive('krossoverCoachGameTeam', [
    function directive() {

        var krossoverCoachGameTeam = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.Team.controller',
            scope: {
                game: '=?',
                scoutingRoster: '=?',
                validation: '=?'
            }
        };

        return krossoverCoachGameTeam;
    }
]);

/**
 * Team controller.
 * @module Team
 * @name Team
 * @type {controller}
 */
Team.controller('Coach.Game.Team.controller', [
    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'Coach.Game.Tabs', 'Coach.Game.Data', 'GamesFactory', 'PlayersFactory',
    function controller(config, $rootScope, $scope, $state, $localStorage, $http, tabs, data, games, players) {
        console.log('working scrimmage team');
        $scope.tabs = tabs;
        $scope.data = {};

        data.then(function(coachData) {
            $scope.data = coachData;
            $scope.positions = coachData.positionSet.indexedPositions;
            if (coachData.teamGameRoster) {
                $scope.data.team = coachData.teams[$scope.game.teamId];
                $scope.data.team.players = players.constructPositionDropdown(coachData.teamGameRoster.players, coachData.game.rosters[coachData.game.teamId].id, $scope.positions);
            }
        });

        $scope.$watch('game', function(game) {
            if (game.rosters) {
                $scope.scoutingTeamId = game.rosters[game.teamId].id;
            }
        });

        $scope.$watch('data.team.players', function(scoutingTeam) {
            if (typeof scoutingTeam !== 'undefined') {
                if (scoutingTeam.length === 0) {
                    console.log(scoutingTeam);
                }
            } else {
                $scope.data.team = {
                    players: []
                };
            }
        });

        $scope.$watch('validation.scoutingTeam', function(valid) {
            if (!valid) {
                tabs['opposing-team'].disabled = true;
                tabs['opposing-team'].active = false;
            } else {
                tabs['opposing-team'].disabled = false;
                tabs['opposing-team'].active = true;
            }

        });

        $scope.save = function() {
            $scope.data.team.players = players.getPositionsFromDowndown($scope.data.team.players, $scope.scoutingTeamId, $scope.positions);
            players.save($scope.game.rosters[$scope.game.teamId].id, $scope.data.team.players);
            tabs.activateTab('opposing-team');
        };

    }
]);

