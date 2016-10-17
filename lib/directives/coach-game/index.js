/* Constants */
var TO = '';
var ELEMENTS = 'E';

import Info from './coach-game-info/index.js';
import Instructions from './coach-game-instructions/index.js';
import GameTab from './game-tab/index.js';


/* Component settings */
var templateUrl = 'lib/directives/coach-game/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Uploading film page module.
 * @module Game
 */
var Game = angular.module('Coach.Game', [
    'ui.router',
    'ui.bootstrap',
    'Coach.Game.Info',
    'Coach.Game.GameTab',
    'Coach.Game.Instructions'
]);

var data = {

    team: {},
    opposingTeam: {}
};

/**
 * Game directive.
 * @module Game
 * @name Game
 * @type {Directive}
 */
Game.directive('krossoverCoachGame', [
    function directive() {

        var krossoverCoachGame = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.controller',
            link: link,

            scope: {
                game: '=',
                league: '=',
                remainingBreakdowns: '='
            }
        };

        function link($scope, element, attributes, controller) {

        }

        return krossoverCoachGame;
    }
]);

/**
 * Game controller.
 * @module Game
 * @name Game.controller
 * @type {controller}
 */
Game.controller('Coach.Game.controller', [
    '$scope', 'TeamsFactory', 'GamesFactory', 'config', 'PositionsetsFactory',
    function controller($scope, teams, games, config, positionSets) {
        $scope.positionset = ($scope.league.id && $scope.league.positionSetId) ? positionSets.get($scope.league.positionSetId) : {};
        $scope.config = config;
        $scope.games = games;
        $scope.teams = teams.getCollection();

        $scope.opposingTeamFiltering = {type: 'active'};
        $scope.teamFiltering = ($scope.game.isRegular()) ? {type: 'none'} : {type: 'active'};

        $scope.gameTabs = {
            info: {
                active: true
            },
            opposing: {
                active: false,
                disabled: true
            },
            team: {
                active: false,
                disabled: true
            },
            confirm: {
                active: false,
                disabled: true
            },
            enableAll: function() {
                var self = this;
                var keys = Object.keys(self);
                angular.forEach(keys, function(key) {
                    self[key].disabled = false;
                });
            },
            deactivateAll: function() {
                var self = this;
                var keys = Object.keys(self);
                angular.forEach(keys, function(key) {
                    self[key].active = false;
                });
            }
        };
    }
]);

export default Game;
