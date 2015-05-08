/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CustomTagsDropdown page module.
 * @module CustomTagsDropdown
 */
const CustomTagsDropdown = angular.module('CustomTagsDropdown');

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

    $scope.tagTypes      = TAG_TYPES;
    $scope.filters       = {};
    $scope.allTags       = []; // All tags returned from the API
    $scope.availableTags = []; // All tags minus tags contained in selectedTags
    $scope.filteredTags  = []; // availableTags filtered by $scope.filters


    /**
    * Tags
    */

    $scope.updateAvailableTags = function() {
        $scope.availableTags = [];

        var idMap = {};
        angular.forEach($scope.selectedTags, function(tag) {
            idMap[tag.id] = true;
        });

        angular.forEach($scope.allTags, function(tag) {
            if (!idMap[tag.id]) {
                $scope.availableTags.push(tag);
            }
        });

        $scope.updateFilteredTags();
    };

    $scope.updateFilteredTags = function() {
        $scope.filteredTags = $filter('filter')($scope.availableTags, $scope.filters);
    };

    $scope.updateAllTags = function() {
        if ($scope.sport) {
            $scope.allTags = TagResource.getAll({
                parentTagId: $scope.sport.id
            }, function() {
                $scope.updateAvailableTags();
            });
        } else {
            $scope.allTags = [];
            $scope.updateAvailableTags();
        }
    };
    $scope.updateAllTags();

    $scope.$watch('sport', $scope.updateAllTags);

    /**
    * Adding / Removing Tags
    */

    $scope.tagAlreadyExists = function(title) {
        var tagCount = $scope.allTags.length;

        for (var i = 0; i < tagCount; i++) {
            var tag = $scope.allTags[i];
            if (tag.title === title) {
                return tag;
            }
        }

        return false;
    };

    $scope.addTag = function(tag) {
        if (tag && tag.title && $scope.selectedTags.indexOf(tag) < 0) {
            $scope.selectedTags.push(tag);
            $scope.updateAvailableTags();
            $scope.clearTagFilter();
        }
    };

    $scope.removeTag = function(tag) {
        if (!tag) {
            return;
        }

        var index = $scope.selectedTags.indexOf(tag);
        if (index >= 0) {
            $scope.selectedTags.splice(index, 1);
            $scope.updateAvailableTags();
        }
    };

    $scope.createNewTag = function(title) {

        if (!title || title === '') {
            return;
        }

        var existingTag = $scope.tagAlreadyExists(title);
        if (existingTag) {
            $scope.addTag(existingTag);
            return;
        }

        TagResource.create({
            title: title,
            type: TAG_TYPES.GENERAL.id,
            parentTagId: $scope.sport.id
        }, function(tag) {
            $scope.addTag(tag);
            $scope.allTags.push(tag);
            $scope.updateAvailableTags();

        });
    };

    /**
    *
    *   Keyboard Navigation
    *
    */

    $scope.hoverTags = function(hovering) {
        $scope.selectingTag = hovering;
    };

    $scope.clearTagFilter = function() {
        $scope.filters = {};
        $scope.tagFilterChanged();
    };

    $scope.tagFilterChanged = function() {
        $scope.setFocusIndex(-1);
        $scope.updateFilteredTags();
    };

    $scope.tagFilterFocus = function() {
        $scope.setFocusIndex(-1);
        $scope.filterFocus = true;
    };

    $scope.tagFilterBlur = function() {
        $scope.filterFocus = false;
    };

    $scope.setFocusIndex = function(index) {
        $scope.focusIndex = Math.min(Math.max(-1, index), $scope.filteredTags.length - 1);
    };

    $scope.$on('keydown', function( msg, code ) {

        switch (code) {
            case KEY_CODES.enter: // Select
                var tag = $scope.filteredTags[$scope.focusIndex];
                if (tag) {
                    $scope.addTag(tag);
                } else {
                    $scope.createNewTag($scope.filter.title);
                }
                break;

            case KEY_CODES.arrowUp: // Previous
                $scope.setFocusIndex($scope.focusIndex - 1);
                break;

            case KEY_CODES.arrowDown: // Next
                $scope.setFocusIndex($scope.focusIndex + 1);
                break;

            case KEY_CODES.esc:
                $document[0].getElementById('add-tag-filter-input').blur();
                $scope.hoverTags(false);
                break;
        }

        $scope.$apply();
    });
}

CustomTagsDropdown.controller('CustomTagsDropdown.Controller', CustomTagsDropdownController);

export default CustomTagsDropdownController;
