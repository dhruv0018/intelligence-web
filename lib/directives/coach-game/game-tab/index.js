/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'lib/directives/coach-game/game-tab/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module GameTab
 */
var GameTab = angular.module('Coach.Game.GameTab', []);

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
    '$scope', '$state', 'PlayersFactory', 'TeamsFactory', 'PositionsetsFactory', 'LeaguesFactory', 'config',
    function controller($scope, $state, players, teams, positionsets, leagues, config) {

        $scope.config = config;

        //Collections
        $scope.teams = teams.getCollection();

        $scope.activateNextTab = function() {
            $scope.tabs.deactivateAll();
            $scope.nextTab.active = true;
        };
    }
]);

export default GameTab;
