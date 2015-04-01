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
Arena.directive('krossoverItemArena', ['ROLES', 'SessionService', 'ArenaModal.Modal', 'ARENA_REGIONS_BY_ID',

    function directive(ROLES, session, ArenaModal, ARENA_REGIONS_BY_ID) {

        var Arena = {

            restrict: TO += ELEMENTS,

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {
            console.log('working');
            // Reference to track if modal is open
            var arenaModalInstance = null;

            $scope.isReset = false;

            // Pass parent scope to child modal via modalOptions
            $scope.options = {scope: $scope};

            // Empty reference for parent scope
            $scope.coordinates = {};

            $scope.ARENA_REGIONS_BY_ID = ARENA_REGIONS_BY_ID;


            $scope.onBlur = function onBlur() {

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

            $scope.resetAndOpenModal = function resetAndOpenModal() {
                $scope.reset();
                $scope.openArenaModal();
            };

            $scope.openArenaModal = function openArenaModal() {

                $scope.isFocused = true;

                $scope.variable.value = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
                arenaModalInstance = ArenaModal.open($scope.options);

                arenaModalInstance.result.finally(function arenaModalPromiseHandler() {
                    $scope.onBlur();
                });
            };

            $scope.closeArenaModal = function closeArenaModal() {

                $scope.isFocused = false;

                if (arenaModalInstance !== null) {
                    arenaModalInstance.close();
                    arenaModalInstance = null;
                }
            };

            $scope.$watch('event.activeEventVariableIndex', function watchEventVariableIndex() {

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
