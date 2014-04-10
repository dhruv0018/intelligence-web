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

    game: {},
    opposingTeam: {}
};

/**
 * Game data value service.
 * @module Game
 * @name Game.Data
 * @type {value}
 */
Game.value('Coach.Game.Data', data);

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

            scope: {

                gameId: '@game'
            }
        };

        return krossoverCoachGame;
    }
]);

/**
 * Game controller.
 * @module Game
 * @name Game.controller
 * @type {Controller}
 */
Game.controller('Coach.Game.controller', [
    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'Coach.Game.Tabs', 'Coach.Game.Data', 'GamesFactory',
    function controller(config, $rootScope, $scope, $state, $localStorage, $http, tabs, data, games) {

        $scope.tabs = tabs;


        console.dir($scope);

        $scope.$watch('gameId', function(gameId) {

            if (gameId) {

                games.get(gameId, function(game) {

                    console.dir(game);
                    data.game = game;
                });
            }
        });

        $scope.$watch('formGameInfo.$invalid', function(invalid) {

            tabs['your-team'].disabled = invalid;
            tabs['opposing-team'].disabled = tabs['opposing-team'].disabled ? true : invalid;
            tabs.instructions.disabled = tabs.instructions.disabled ? true : invalid;
        });

        $scope.$watch('formYourTeam.$invalid', function(invalid) {

            tabs['opposing-team'].disabled = tabs['opposing-team'].disabled ? true : invalid;
            tabs.instructions.disabled = tabs.instructions.disabled ? true : invalid;
        });

        $scope.$watch('formOpposingTeam.$invalid', function(invalid) {

            tabs.instructions.disabled = tabs.instructions.disabled ? true : invalid;
        });
    }
]);

