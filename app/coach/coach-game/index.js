/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component dependencies. */
require('coach-game-info');
require('coach-game-your-team');
require('coach-game-opposing-team');
require('coach-game-instructions');
require('coach-game-team');

/* Component settings */
var templateUrl = 'coach/game/template.html';

/* Component resources */
var template = require('./template.html');

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
    'Coach.Game.YourTeam',
    'Coach.Game.OpposingTeam',
    'Coach.Game.Instructions',
    'Coach.Game.Team'
]);

/* Cache the template file */
Game.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
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
                data: '=?',
                $flow: '=?flow'
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
    '$scope', 'TeamsFactory', 'GamesFactory',
    function controller($scope, teams, games) {

        $scope.games = games;

        $scope.teams = teams.getCollection();

        $scope.validation = {
            opposingTeam: false,
            yourTeam: false,
            scoutingTeam: false
        };

        $scope.gameTabs = {
            info: {
                active: true
            },
            scouting: {
                active: false,
                disabled: true
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
                // this.scouting.disabled = false;
                // this.opposing.disabled = false;
                // this.team.disabled = false;
                // this.confirm.disabled = false;
            },
            deactivateAll: function() {
                var self = this;
                var keys = Object.keys(self);
                angular.forEach(keys, function(key) {
                    self[key].active = false;
                });
            }
        };

//        $scope.game = $scope.game || {};
    }
]);

