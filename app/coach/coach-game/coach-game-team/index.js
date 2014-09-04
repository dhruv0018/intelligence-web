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
                data: '=',
                validation: '=?',
                tabs: '='
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
    'config', '$rootScope', '$scope', '$state', 'GamesFactory', 'PlayersFactory',
    function controller(config, $rootScope, $scope, $state, games, players) {
        $scope.config = config;

        //Positions
        $scope.positions = ($scope.data.league.positionSetId) ? $scope.data.positionSets.getCollection()[$scope.data.league.positionSetId].indexedPositions : {};

        //TODO: temporary fix of tabs flow
        function enableAllTabs() {
            $scope.tabs.scouting.disabled = false;
            $scope.tabs.opposing.disabled = false;
            $scope.tabs.team.disabled = false;
            $scope.tabs.confirm.disabled = false;
        }

        $scope.$watch('data.game', function(game) {

            if (game &&
                game.teamId &&
                $scope.data &&
                $scope.data.gamePlayerLists &&
                $scope.data.gamePlayerLists[game.teamId]) {
                if (Object.keys($scope.positions).length > 0) {
                    angular.forEach($scope.data.gamePlayerLists[game.teamId], function(player) {
                        player = players.constructPositionDropdown(player, game.rosters[game.teamId].id, $scope.positions);
                    });
                }
            }

        });

        $scope.save = function() {

            enableAllTabs();
            $scope.tabs.opposing.active = true;

            if (Object.keys($scope.positions).length > 0) {
                angular.forEach($scope.data.gamePlayerLists[$scope.data.game.teamId], function(player) {
                    player = players.getPositionsFromDowndown(player, $scope.data.game.rosters[$scope.data.game.teamId].id, $scope.positions);
                });
            }

            players.save($scope.data.game.rosters[$scope.data.game.teamId].id, $scope.data.gamePlayerLists[$scope.data.game.teamId]).then(function(roster) {
                $scope.data.gamePlayerLists[$scope.data.game.teamId] = roster;

                if (Object.keys($scope.positions).length > 0) {
                    angular.forEach($scope.data.gamePlayerLists[$scope.data.game.teamId], function(player) {
                        player = players.constructPositionDropdown(player, $scope.data.game.rosters[$scope.data.game.teamId].id, $scope.positions);
                    });
                }
            });

        };

    }
]);

