/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* SearchDropdown dependencies
*/
SearchDropdownController.$inject = [
    '$scope',
    '$filter',
    'SessionService',
    'KEYBOARD_CODES'
];

/**
 * SearchDropdown controller.
 * @module SearchDropdown
 * @name SearchDropdown.controller
 * @type {controller}
 */
function SearchDropdownController (
    $scope,
    $filter,
    session,
    KEYBOARD_CODES
) {
    $scope.optionLabel = $scope.optionLabel || 'Option';
    $scope.filters = {};
    $scope.focusIndex = -1; // focus index for keyboard navigation

    $scope.selectOption = function(option) {

    };

    /* Keyboard Navigation */

    $scope.keyPressTracker = function(keyEvent, name) {
        switch (keyEvent.which) {
            case KEYBOARD_CODES.ENTER: //Select option
                let option = $scope.matchingOptions[$scope.focusIndex];
                if (option) {
                    $scope.selectOption(option);
                }
            break;

            case KEYBOARD_CODES.DOWN_ARROW:
                $scope.setFocusIndex($scope.focusIndex + 1);
            break;

            case KEYBOARD_CODES.UP_ARROW:
                $scope.setFocusIndex($scope.focusIndex - 1);
            break;

            case KEYBOARD_CODES.ESC:
                $scope.status.isopen = false;
            break;
        }
    };

    $scope.setFocusIndex = function(index) {
        $scope.focusIndex = Math.min(Math.max(-1, index), $scope.matchingOptions.length - 1);
    };
}

export default SearchDropdownController;
