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
    '$scope', '$state', 'PlayersFactory', 'TeamsFactory', 'PositionsetsFactory', 'LeaguesFactory', 'config', 'BasicModals', 'SessionService',
    function controller($scope, $state, players, teams, positionsets, leagues, config, basicModals, session) {

        $scope.config = config;

        //Collections
        $scope.teams = teams.getCollection();

        $scope.activateNextTab = function() {
            let isUserTeam = ($scope.team && $scope.team.id) ? session.currentUser.currentRole.teamId === $scope.team.id : false;
            let isAmendable = !$scope.game.isDelivered() && !$scope.game.isBeingBrokenDown() && isUserTeam;
            if (isAmendable && hasInactivePlayers()) {
                let bodyText = "You've marked players that 'Did Not Play'.\r\n";
                bodyText += 'These players will <span class="bold">not</span> appear in the breakdown or stats of this game.\r\n';
                bodyText += '\r\nAre you sure you want to continue?';
                let modalInstance = basicModals.openForConfirm({
                    title: 'Did Not Play',
                    bodyText,
                    buttonText: 'Yes, continue',
                    cancelButtonText: 'Cancel'
                });

                modalInstance.result.then(function confirmed() {
                    activateNextTab();
                });
                return;
            }

            activateNextTab();
        };

        let activateNextTab = function activateNextTab() {
            $scope.tabs.deactivateAll();
            $scope.nextTab.active = true;
        };

        let hasInactivePlayers = function hasInactivePlayers () {
            let count = 0;
            if ($scope.game.rosters[$scope.team.id]) {
                let playerInfo = $scope.game.rosters[$scope.team.id].playerInfo;
                // cannot use the some/forEach as they are objects
                for (let playerId in playerInfo) {
                    if (!playerInfo[playerId].isActive) {
                        return true;
                    }
                }
            }
            return false;
        };
    }
]);

export default GameTab;
