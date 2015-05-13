/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* CustomTagsDropdown dependencies
*/
CustomTagsDropdownController.$inject = [
    '$scope',
    '$filter',
    'CustomtagsFactory',
    'TeamsFactory',
    'SessionService'
];

/**
 * CustomTagsDropdown controller.
 * @module CustomTagsDropdown
 * @name CustomTagsDropdown.controller
 * @type {controller}
 */
function CustomTagsDropdownController (
    $scope,
    $filter,
    customtags,
    teams,
    session
) {
    $scope.customTags = customtags.getList();
    $scope.filters = {};
    $scope.selectedTags = [];
    $scope.availableTags = [];
    $scope.filteredTags = [];

    $scope.$watch('selectedTags.length', function() {
        updateAvailableTags();
    });

    $scope.selectTag = function(tag) {
        $scope.selectedTags.push(tag);
    };

    function updateAvailableTags() {
        $scope.availableTags = [];
        let idMap = {};

        if ($scope.selectedTags.length) {
            $scope.selectedTags.forEach( tag => {
                idMap[tag.id] = true;
            });
        }

        $scope.customTags.forEach( tag => {
            if (!idMap[tag.id]) {
                $scope.availableTags.push(tag);
            }
        });

        $scope.updateFilteredTags();
    }

    $scope.updateFilteredTags = function() {
        $scope.filteredTags = $filter('filter')($scope.availableTags, $scope.filters);
    };

    $scope.createNewTag = function(name) {

        // Return if there is no tag name
        if (!name || name === '') {
            return;
        }

        // If tag exists, simply select it and return
        let existingTag = $scope.tagAlreadyExists(name);
        if (existingTag) {
            $scope.selectTag(existingTag);
            $scope.clearTagFilter();
            return;
        }

        let tag = customtags.create({
            name: name,
            teamId: session.getCurrentTeamId()
        });

        $scope.selectTag(tag);
        $scope.clearTagFilter();
    };

    $scope.tagAlreadyExists = function(name) {
        //Returns tag if there is a match, otherwise returns false
        let result = false;

        $scope.customTags.forEach( tag => {
            if (tag.name === name) result = tag;
        });

        return result;
    };

    $scope.cancelTagging = function() {
        $scope.clearTagFilter();
        $scope.selectedTags = []; // set to existing tags for that play
    };

    $scope.keyPressTracker = function(keyEvent, name) {
        if (keyEvent.which === 13) $scope.createNewTag(name);
    };

    $scope.clearTagFilter = function() {
        $scope.filters = {};
        $scope.updateFilteredTags();
    };
}

export default CustomTagsDropdownController;
