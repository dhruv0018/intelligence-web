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
 * @module Arena
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
                autoAdvance: '=?'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            var currentUser = session.currentUser;
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
                console.log('onBlur, autoAdvance: ', $scope.autoAdvance, ', activeEventVariableIndex: ', $scope.event.activeEventVariableIndex);
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
            };

            $scope.shouldFocus = function() {
                console.log('shouldFocus, autoAdvance: ', $scope.autoAdvance, ', activeEventVariableIndex: ', $scope.event.activeEventVariableIndex);
                if ($scope.autoAdvance === true) {
                    return $scope.event.activeEventVariableIndex == $scope.item.index;
                } else {
                    return $scope.isReset;
                }
            };

            $scope.reset = function() {
                console.log('reset, autoAdvance: ', $scope.autoAdvance, ', activeEventVariableIndex: ', $scope.event.activeEventVariableIndex);
                if ($scope.autoAdvance === true) {
                    $scope.event.activeEventVariableIndex = $scope.item.index;
                } else {
                    $scope.event.activeEventVariableIndex = 0;
                }
                $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
                $scope.event.variableValues[$scope.item.id].value = undefined;
                $scope.isReset = true;
            };

            $scope.resetAndOpenModal = function() {
                $scope.reset();
                $scope.openArenaModal();
            };

            $scope.openArenaModal = function() {

                if (arenaModalInstance === null) {
                    arenaModalInstance = ArenaModal.open($scope.options);
                }
            };

            $scope.closeArenaModal = function() {

                if (arenaModalInstance !== null) {
                    arenaModalInstance.close();
                    arenaModalInstance = null;
                }
            };

            // $scope.$watch('event.variableValues[item.id].value', function() {
            //     console.log('Item', $scope.event.variableValues[$scope.item.id].value);
            // });
            // $scope.$watch('autoAdvance', function() {
            //     console.log('AutoAdvance', $scope.autoAdvance);
            // });

            // var toggleArenaModal = function(condition) {
            //     if (condition) {
            //         arenaModalInstance = ArenaModal.open($scope.options);
            //     } else {
            //         arenaModalInstance.close();
            //     }
            // };

            $scope.$watch('event.activeEventVariableIndex', function() {
                console.log('ActiveEventVariableIndex', $scope.event.activeEventVariableIndex);
                // if ($scope.autoAdvance === true) {
                //     console.log('1');
                //     toggleArenaModal($scope.event.activeEventVariableIndex === $scope.item.index);
                // }
                if ($scope.event.activeEventVariableIndex !== $scope.item.index) {
                    $scope.closeArenaModal();
                }
            });
        }

        return Arena;
    }
]);

