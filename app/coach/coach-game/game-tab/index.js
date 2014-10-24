/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/your-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module GameTab
 */
var GameTab = angular.module('Coach.Game.GameTab', []);

/* Cache the template file */
GameTab.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * GameTab directive.
 * @module GameTab
 * @name GameTab
 * @type {directive}
 */
GameTab.directive('gameTab', [
    function directive() {

        var coachGameGameTab = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.GameTab.controller',

            scope: {
                data: '=',
                tabs: '=',
                type: '=',
                rosterLinks: '=',
                rosterId: '=',
                team: '=',
                game: '=',
                editable: '=',
                roster: '=',
                validator: '=',
                filtering: '=',
                positionset: '=',
                heading: '@',
                nextTab: '='
            }
        };

        return coachGameGameTab;
    }
]);
/**
 * GameTab controller.
 * @module GameTab
 * @name GameTab
 * @type {controller}
 */
GameTab.controller('Coach.Game.GameTab.controller', [
    '$scope', '$state', 'PlayersFactory', 'TeamsFactory', 'PositionsetsFactory', 'LeaguesFactory',
    function controller($scope, $state, players, teams, positionsets, leagues) {

        //Collections
        $scope.teams = teams.getCollection();

        $scope.activateTab = function() {
            $scope.tabs.deactivateAll();
            $scope.nextTab.active = true;
        };
    }
]);

