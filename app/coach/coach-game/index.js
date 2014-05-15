/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component dependencies. */
require('coach-game-info');
require('coach-game-your-team');
require('coach-game-opposing-team');
require('coach-game-instructions');

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
    'Coach.Game.Instructions'
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
    'opposing-team': { active: false, disabled: true },
    instructions:    { active: false, disabled: true },
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
    '$scope', 'Coach.Game.Tabs',
    function controller($scope, tabs) {

        $scope.tabs = tabs;

        $scope.game = $scope.game || {};
    }
]);

