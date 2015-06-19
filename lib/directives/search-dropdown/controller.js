/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* SearchDropdown dependencies
*/
SearchDropdownController.$inject = [
    '$scope'
];

/**
 * SearchDropdown controller.
 * @module SearchDropdown
 * @name SearchDropdown.controller
 * @type {controller}
 */
function SearchDropdownController (
    $scope
) {
    $scope.optionLabel = $scope.optionLabel || 'Option';
    $scope.filters = {};
    // TODO: use when KEYBOARD_CODES are in
    //$scope.focusIndex = -1; // focus index for keyboard navigation

    $scope.selectOption = function(option) {
        $scope.selectedOption = option;

        if ($scope.onSelect) {
            $scope.onSelect(option);
        }

        // Collapse dropdown
        $scope.status.isopen = false;
    };

    /* Keyboard Navigation */
    /* TODO: use when KEYBOARD_CODES are in
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
    end TODO */
}

export default SearchDropdownController;
