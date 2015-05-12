/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* CustomTagsDropdown dependencies
*/
CustomTagsDropdownController.$inject = [
    '$scope',
    '$filter'
];

/**
 * CustomTagsDropdown controller.
 * @module CustomTagsDropdown
 * @name CustomTagsDropdown.controller
 * @type {controller}
 */
function CustomTagsDropdownController (
    $scope,
    $filter
) {
    $scope.customTags = [
        {
            id: 1,
            name: 'Shotgun'
        },
        {
            id: 2,
            name: 'Pistol'
        },
        {
            id: 3,
            name: 'Wildcat'
        }
    ];

    $scope.filters = {};
    $scope.selectedTags = [];
    $scope.availableTags = [];
    $scope.filteredTags = [];

    $scope.$watch('selectedTags.length', function() {
        updateAvailableTags();
    });

    $scope.selectTag = function selectTag(tag) {
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
            return;
        }

        let newTag = {
            name: name
        };

        $scope.customTags.push(newTag);
        $scope.selectTag(newTag);
        $scope.filters = {};
    };

    $scope.tagAlreadyExists = function(name) {
        //Returns tag if there is a match, otherwise returns false
        $scope.customTags.forEach( tag => {
            if (tag.name === name) return tag;
        });

        return false;
    };

    $scope.cancelTagging = function() {
        $scope.filters = {};
        $scope.selectedTags = []; // set to existing tags for that play
    };
}

export default CustomTagsDropdownController;
