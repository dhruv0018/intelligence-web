/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/arena.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Arena
 * @module Arenas
 */
var Arena = angular.module('Item.Arena', []);

/* Cache the template file */
Arena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Arena directive.
 * @module Arena
 * @name Arena
 * @type {Directive}
 */
Arena.directive('krossoverItemArena', ['ROLES', 'SessionService', 'ArenaModal.Modal',

    function directive(ROLES, session, ArenaModal) {

        var Arena = {

            restrict: TO += ELEMENTS,

            scope: {
                item: '=',
                event: '=',
                league: '=',
                autoAdvance: '=?',
                isEditable: '=?'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.isEditable = angular.isDefined($scope.isEditable) ? $scope.isEditable : true;

            var currentUser = session.currentUser;

            // Reference to track if modal is open
            var arenaModalInstance = null;

            $scope.variable = {};

            $scope.isCoach = currentUser.is(ROLES.COACH);
            $scope.isIndexer = currentUser.is(ROLES.INDEXER);

            $scope.isReset = false;

            // Pass parent scope to child modal via modalOptions
            $scope.options = {scope: $scope};

            // Empty reference for parent scope
            $scope.coordinates = {};

            $scope.isUndefined = function(item) {
                return angular.isUndefined(item);
            };

            $scope.onBlur = function() {

                $scope.isReset = false;
                if (!$scope.variable.value) {
                    if ($scope.item.isRequired) {
                        $scope.event.variableValues[$scope.item.id].value = $scope.previousValue;
                    } else {
                        $scope.event.variableValues[$scope.item.id].value = null;
                    }
                } else {
                    $scope.event.variableValues[$scope.item.id].value = $scope.variable.value;
                }

                // Make sure to close the modal
                $scope.closeArenaModal();
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
                $scope.variable.value = undefined;
                $scope.isReset = true;
            };

            $scope.resetAndOpenModal = function() {
                $scope.reset();
                $scope.openArenaModal();
            };

            $scope.openArenaModal = function() {

                $scope.isFocused = true;

                $scope.variable.value = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
                arenaModalInstance = ArenaModal.open($scope.options);

                arenaModalInstance.result.finally(function() {
                    $scope.onBlur();
                });
            };

            $scope.closeArenaModal = function() {

                $scope.isFocused = false;

                if (arenaModalInstance !== null) {
                    arenaModalInstance.close();
                    arenaModalInstance = null;
                }
            };

            $scope.$watch('event.variableValues[item.id].value', function(value) {

                if (angular.isUndefined(value)) {

                    $scope.variable.value = undefined;
                }
            });

            $scope.$watch('event.activeEventVariableIndex', function() {

                // Use case: indexer presses enter or esc to navigate items, modal should close
                if ($scope.autoAdvance === true) {

                    if ($scope.event.activeEventVariableIndex !== $scope.item.index &&
                        arenaModalInstance !== null) {

                        $scope.closeArenaModal();
                    }
                }
            });
        }

        return Arena;
    }
]);

