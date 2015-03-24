/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/player-dropdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlayerDropdown
 * @module PlayerDropdown
 */
var PlayerDropdown = angular.module('Item.PlayerDropdown', []);

/* Cache the template file */
PlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('item/player-dropdown-input.html', require('./player-dropdown-input.html'));
    }
]);

/**
 * PlayerDropdown directive.
 * @module PlayerDropdown
 * @name PlayerDropdown
 * @type {Directive}
 */
PlayerDropdown.directive('krossoverItemPlayerDropdown', [
    'ROLES', 'SessionService', 'TagsetsFactory', 'TeamsFactory', 'PlayersFactory', '$timeout', 'PlayerlistManager',
    function directive(ROLES, session, tagsets, teams, players, $timeout, playerlist) {

        var PlayerDropdown = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                game: '=',
                item: '=',
                play: '=',
                plays: '=',
                event: '=',
                league: '=',
                autoAdvance: '=?',
                isEditable: '=?'
            },

            link: link,

            controller: 'PlayerDropdown.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.isEditable = angular.isDefined($scope.isEditable) ? $scope.isEditable : true;

            var tagId = $scope.event.tagId;
            var tagsetId = $scope.league.tagSetId;
            var tagset = tagsets.get(tagsetId);
            var tags = tagset.tags;
            var tag = tags[tagId];
            var currentUser = session.currentUser;
            var team = teams.get($scope.game.teamId);
            var opposingTeam = teams.get($scope.game.opposingTeamId);

            // Don't need to populate these if the drop-down isn't editable
            var teamPlayers;
            var opposingTeamPlayers;
            if ($scope.isEditable) {
                teamPlayers = $scope.game.getTeamPlayers();
                opposingTeamPlayers = $scope.game.getOpposingTeamPlayers();
            }

            $scope.isReset = false;
            $scope.isCoach = currentUser.is(ROLES.COACH);
            $scope.isIndexer = currentUser.is(ROLES.INDEXER);
            $scope.event.variableValues[$scope.item.id].type = 'Player';
            $scope.teamRoster = $scope.game.getRoster(team.id);
            $scope.opposingTeamRoster = $scope.game.getRoster(opposingTeam.id);

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

            $scope.onChange = function() {
                if ($scope.autoAdvance === true) {
                    $scope.event.activeEventVariableIndex = $scope.item.index + 1;
                }
            };

            $scope.onBlur = function() {
                // TODO: THIS IS A BAD HACK. THERE ARE MORE COMPLEX, BUT BETTER WAYS TO DO THIS.
                // THIS TIMEOUT IS SET TO 200 SO THAT THE CODE INSIDE DOES NOT RESET THE VALUE
                // BEFORE THE selectPlayer FUNCTION CAN BE EXECUTED WHEN A USER CLICKS ON THE
                // DROP DOWN RESULTS AND BLUR EVENT FIRES.
                // THIS IS ONLY BEING DONE SINCE THE BUG THAT IT FIXES IS CUSTOMER FACING
                $timeout(function() {
                    $scope.isReset = false;
                    if (!$scope.event.variableValues[$scope.item.id].value) {
                        if ($scope.item.isRequired) {
                            $scope.event.variableValues[$scope.item.id].value = $scope.previousValue;
                        } else {
                            $scope.event.variableValues[$scope.item.id].value = null;
                        }
                    }
                }, 200);
            };

            $scope.shouldFocus = function() {
                if ($scope.autoAdvance === true) {
                    return $scope.event.activeEventVariableIndex == $scope.item.index;
                } else {
                    return $scope.isReset;
                }
            };

            $scope.reset = function() {
                if ($scope.autoAdvance === true) {
                    $scope.event.activeEventVariableIndex = $scope.item.index;
                } else {
                    $scope.event.activeEventVariableIndex = 0;
                }
                $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
                $scope.event.variableValues[$scope.item.id].value = undefined;
                $scope.isReset = true;
            };

            $scope.players = players.getCollection();
            $scope.playersList = playerlist.get();

            if ($scope.item.index === 1 && !$scope.autoAdvance) {

                $scope.$watch('event.variableValues[item.id].value', function(variableValue, previousVariableValue) {

                    // TODO: recalculate
                });

                element.on('$destroy', function() {

                    // TODO: recalculate
                });
            }
        }

        return PlayerDropdown;
    }
]);

/**
 * PlayerDropdown controller.
 * @module PlayerDropdown
 * @name PlayerDropdown.controller
 * @type {controller}
 */
PlayerDropdown.controller('PlayerDropdown.controller', [
    '$scope',
    function controller($scope) {

        $scope.selectPlayer = function($item) {

            $scope.event.variableValues[$scope.item.id].value = $item.id;
        };
    }
]);
