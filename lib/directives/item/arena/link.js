/**
 * Arena link function
 * @module Item
 */
module.exports = function arenaItemLink($scope, $element, $attributes, ctrl, $transclude, $injector) {

    /**
     * Inject dependencies
     */

    var session = $injector.get('SessionService');
    var ROLES = $injector.get('ROLES');
    var ArenaModal = $injector.get('ArenaModal');
    var ARENA_IDS = $injector.get('ARENA_IDS');
    var ARENA_REGIONS = $injector.get('ARENA_REGIONS');

    /**
    * Scope Functions
    */

    var currentUser = session.currentUser;

    $scope.isEditable = angular.isDefined($scope.isEditable) ? $scope.isEditable : true;

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


    /**
    * Scope Functions
    */

    $scope.isUndefined = function isUndefined(item) {
        return angular.isUndefined(item);
    };

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

    $scope.shouldFocus = function shouldFocus() {

        if ($scope.autoAdvance === true) {
            return $scope.event.activeEventVariableIndex == $scope.item.index;
        } else {
            return $scope.isReset;
        }
    };

    $scope.reset = function reset() {

        if ($scope.autoAdvance === true) {
            $scope.event.activeEventVariableIndex = $scope.item.index;
        } else {
            $scope.event.activeEventVariableIndex = 0;
        }
        $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
        $scope.variable.value = undefined;
        $scope.isReset = true;
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

    $scope.$watch('event.variableValues[item.id].value', function watchVariableValue(value) {

        if (angular.isUndefined(value)) {

            $scope.variable.value = undefined;
        }
    });

    $scope.$watch('event.activeEventVariableIndex', function watchEventVariableIndex() {

        // Use case: indexer presses enter or esc to navigate items, modal should close
        if ($scope.autoAdvance === true) {

            if ($scope.event.activeEventVariableIndex !== $scope.item.index &&
                arenaModalInstance !== null) {

                $scope.closeArenaModal();
            }
        }
    });

    $scope.$watch('variable.value.region', function watchRegion(region) {
        var regions = ARENA_REGIONS[ARENA_IDS[$scope.league.arenaId]];
        var regionKeys = Object.keys(regions);

        for (var i = 0; i < Object.keys(regions).length; i++) {

            if (regions[regionKeys[i]].id === region) {

                $scope.description = regions[regionKeys[i]].description;
                break;
            }
        }
    });
};
