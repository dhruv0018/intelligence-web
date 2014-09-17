/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/opposing-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Opposing Team page module.
 * @module OpposingTeam
 */
var OpposingTeam = angular.module('Coach.Game.OpposingTeam', []);

/* Cache the template file */
OpposingTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * OpposingTeam directive.
 * @module OpposingTeam
 * @name OpposingTeam
 * @type {directive}
 */
OpposingTeam.directive('krossoverCoachGameOpposingTeam', [
    function directive() {

        var krossoverCoachGameOpposingTeam = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.OpposingTeam.controller',

            scope: {
                opposingTeamRoster: '=?',
                game: '=?',
                data: '=',
                tabs: '='
            }
        };

        return krossoverCoachGameOpposingTeam;
    }
]);

/**
 * OpposingTeam controller.
 * @module OpposingTeam
 * @name OpposingTeam
 * @type {controller}
 */
OpposingTeam.controller('Coach.Game.OpposingTeam.controller', [
    'config', '$rootScope', '$scope', '$state', '$http', 'GamesFactory', 'PlayersFactory',
    function controller(config, $rootScope, $scope, $state, $http, games, players) {
        $scope.config = config;

        //Collections
        $scope.teams = $scope.data.teams.getCollection();

        //Positions
        $scope.positions = ($scope.data.league.positionSetId) ? $scope.data.positionSets.getCollection()[$scope.data.league.positionSetId].indexedPositions : {};

        $scope.$watch('data.game', function(game) {
            if (game.id) {
                $scope.data.game.opposingTeamRosterId = game.rosters[game.opposingTeamId].id;
            }
        });

        $scope.save = function() {

            players.save($scope.data.game.rosters[$scope.data.game.opposingTeamId].id, $scope.data.gamePlayerLists[$scope.data.game.opposingTeamId]).then(function(roster) {
                $scope.data.gamePlayerLists[$scope.data.game.opposingTeamId] = roster;
            });

            $scope.tabs.deactivateAll();
            $scope.tabs.confirm.active = true;
        };

    }
]);

