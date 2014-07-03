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

//var tabs = {
//
//    'game-info':     { active: true, disabled: false },
//    'your-team':     { active: false, disabled: true },
//    'scouting-team':    { active: false, disabled: true },
//    'opposing-team': { active: false, disabled: true },
//    'instructions':    { active: false, disabled: true },
//    reset: function() {
//        this['game-info'] = {
//            active: true,
//            disabled: false
//        };
//
//        this['your-team'] = {
//            active: false,
//            disabled: true
//        };
//
//        this['scouting-team'] = {
//            active: false,
//            disabled: true
//        };
//
//        this['opposing-team'] = {
//            active: false,
//            disabled: true
//        };
//
//        this.instructions = {
//            active: false,
//            disabled: true
//        };
//    }
//};
//
//Object.defineProperty(tabs, 'activateTab', {
//
//    value: function(activeTab) {
//
//        Object.keys(this).forEach(function(tab) {
//
//            tabs[tab].active = tab === activeTab;
//        });
//    }
//});

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
                data: '=?'
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
    '$scope', 'GamesFactory',
    function controller($scope, games) {
        $scope.games = games;

        $scope.headings = {
            opposingTeam: 'Opposing Team',
            yourTeam: 'Team',
            scoutingTeam: 'Scouting'
        };

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
            activateAll: function() {
                this.scouting.disabled = false;
                this.opposing.disabled = false;
                this.team.disabled = false;
                this.confirm.disabled = false;
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

