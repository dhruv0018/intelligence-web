/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* SearchPlayerDropdown dependencies
*/
SearchPlayerDropdownController.$inject = [
    '$scope'
];

/**
 * SearchPlayerDropdown controller.
 * @module SearchPlayerDropdown
 * @name SearchPlayerDropdown.controller
 * @type {controller}
 */
function SearchPlayerDropdownController (
    $scope
) {
    $scope.label = $scope.label || 'Option';
    $scope.filters = {};
    let playersList = $scope.players;
    // TODO: use when KEYBOARD_CODES are in
    //$scope.focusIndex = -1; // focus index for keyboard navigation

    $scope.$on('clear-search-dropdown-filter', () => $scope.filters = {});

    $scope.selectPlayer = function(player) {

        $scope.selectedPlayer = player;

        if ($scope.onSelect) {
            $scope.onSelect(player);
        }

        // Collapse dropdown
        $scope.status.isopen = false;
    };

    $scope.playerFilter = {
        active : true,
        inactive: true
    };

    $scope.filterPlayers = function filterPlayers() {
        if ($scope.playerFilter.active && $scope.playerFilter.inactive) {
            $scope.players = playersList;
        } else if (!$scope.playerFilter.active && !$scope.playerFilter.inactive) {
            $scope.players = [];
        } else {
            $scope.players = playersList.filter(player => {
                return $scope.team.roster.playerInfo[player.id]
                && (($scope.playerFilter.active && $scope.team.roster.playerInfo[player.id].isActive)
                    || ($scope.playerFilter.inactive && !$scope.team.roster.playerInfo[player.id].isActive));
            });
        }
    };
}

export default SearchPlayerDropdownController;
