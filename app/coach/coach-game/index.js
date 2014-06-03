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

var tabs = {

    'game-info':     { active: true, disabled: false },
    'your-team':     { active: false, disabled: true },
    'scouting-team':    { active: false, disabled: true },
    'opposing-team': { active: false, disabled: true },
    'instructions':    { active: false, disabled: true },
    reset: function() {
        delete this['game-info'];
        delete this['your-team'];
        delete this['scouting-team'];
        delete this['opposing-team'];
        delete this.instructions;

        this['game-info'] = {
            active: true,
            disabled: false
        };

        this['your-team'] = {
            active: false,
            disabled: true
        };

        this['scouting-team'] = {
            active: false,
            disabled: true
        };

        this['opposing-team'] = {
            active: false,
            disabled: true
        };

        this.instructions = {
            active: false,
            disabled: true
        };
    }
};

Object.defineProperty(tabs, 'activateTab', {

    value: function(activeTab) {

        Object.keys(this).forEach(function(tab) {

            tabs[tab].active = tab === activeTab;
        });
    }
});

/**
 * Game tabs value service.
 * @module Game
 * @name Game.Tabs
 * @type {value}
 */
Game.value('Coach.Game.Tabs', tabs);

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
    'Coach.Game.Data',
    function directive(data) {

        var krossoverCoachGame = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.controller',
            link: link,

            scope: {
                roster: '=?',
                opposingTeamRoster: '=?',
                game: '=?'
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
    '$scope', 'Coach.Game.Tabs', 'GamesFactory',
    function controller($scope, tabs, games) {
        $scope.games = games;

        $scope.headings = {
            opposingTeam: 'Opposing Team',
            yourTeam: 'Your Team',
            scoutingTeam: 'Team'
        };

        $scope.validation = {
            opposingTeam: false,
            yourTeam: false,
            scoutingTeam: false
        };

        $scope.tabs = tabs;

        $scope.game = $scope.game || {};
    }
]);

