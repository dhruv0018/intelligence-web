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
    'PlaysFactory',
    'SessionService',
    'PlaylistEventEmitter',
    'CustomTagsEvent',
    'PLAYLIST_EVENTS',
    'CUSTOM_TAGS_EVENTS',
    'KEYBOARD_CODES'
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
    plays,
    session,
    playlistEventEmitter,
    CustomTagsEvent,
    PLAYLIST_EVENTS,
    CUSTOM_TAGS_EVENTS,
    KEYBOARD_CODES
) {
    let teamId = session.getCurrentTeamId();
    let team = teams.get(teamId);
    $scope.customTags = customtags.getTagsByTeam(team);
    $scope.filters = {};
    $scope.selectedTags = []; // tags to be applied
    $scope.availableTags = []; // tags available to select (all tags minus selected ones)
    $scope.filteredTags = []; // available tags filtered by search input
    $scope.focusIndex = -1; // focus index for keyboard navigation

    $scope.$watch('selectedTags.length', updateAvailableTags);

    $scope.selectTag = function(tag) {
        let tagAlreadySelected = false;
        $scope.selectedTags.find( selectedTag => {
            if (selectedTag.name === tag.name) tagAlreadySelected = true;
        });

        if (!tagAlreadySelected) $scope.selectedTags.push(tag);
    };

    function updateAvailableTags() {
        $scope.availableTags = [];
        let tagIdMap = {};

        /* Add selected tag ids to map */
        if ($scope.selectedTags.length) {
            $scope.selectedTags.forEach(tag => tagIdMap[tag.id] = true);
        }

        /* Update available tags to reflect all tags that aren't selected */
        $scope.customTags.forEach(tag => {
            if (!tagIdMap[tag.id]) {
                $scope.availableTags.push(tag);
            }
        });

        /* Sort available tags alphabetically */
        $scope.availableTags.sort( (a, b) => {
            return a.name.localeCompare(b.name);
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
            name,
            teamId
        });

        $scope.selectTag(tag);
        $scope.clearTagFilter();
    };

    $scope.tagAlreadyExists = function(name) {
        //Returns tag if there is a match
        return $scope.customTags.find( tag => {
            return tag.name === name;
        });
    };

    $scope.cancelTagging = function() {
        $scope.clearTagFilter();
        $scope.selectedTags = []; // clear selected tags
        $scope.status.isopen = false; // close dropdown
        $scope.setFocusIndex(-1); // reset focus index
    };

    $scope.clearTagFilter = function() {
        $scope.filters = {};
        $scope.updateFilteredTags();
    };

    $scope.applyTags = function() {
        $scope.tagsApplying = true;
        customtags.batchSave($scope.selectedTags).then( tags => {
            $scope.selectedTags = tags;
            $scope.selectedTagIds = $scope.selectedTags.map(tag => tag.id);
            $scope.customTags = customtags.getTagsByTeam(team);

            // Add custom tag ids to each play with no duplicates
            // TODO: use set?
            $scope.plays.forEach(play => {
                $scope.selectedTagIds.forEach(tagId => {
                    if (play.customTagIds.indexOf(tagId) == -1) {
                        play.customTagIds.push(tagId);
                    }
                });
            });

            let updatedPlayIds = [];
            let updatedTagCount = $scope.selectedTagIds.length;

            // Save plays as a batch
            plays.batchSave($scope.plays).then(function deselectPlays() {
                $scope.tagsApplying = false;
                $scope.plays.forEach(play => {
                    play.isSelected = false;
                    updatedPlayIds.push(play.id);
                });
                $scope.cancelTagging();

                let customTagsEvent = new CustomTagsEvent(updatedPlayIds, updatedTagCount, true);
                playlistEventEmitter.emit(CUSTOM_TAGS_EVENTS.SAVE, customTagsEvent);
                playlistEventEmitter.emit(PLAYLIST_EVENTS.SELECT_PLAY_EVENT);
            });
        });

    };

    /* Keyboard Navigation */

    $scope.keyPressTracker = function(keyEvent, name) {
        switch (keyEvent.which) {
            case KEYBOARD_CODES.ENTER: //Select tag
                let tag = $scope.filteredTags[$scope.focusIndex];
                if (tag) {
                    $scope.selectTag(tag);
                } else {
                    $scope.createNewTag(name);
                }
            break;

            case KEYBOARD_CODES.DOWN_ARROW:
                $scope.setFocusIndex($scope.focusIndex + 1);
            break;

            case KEYBOARD_CODES.UP_ARROW:
                $scope.setFocusIndex($scope.focusIndex - 1);
            break;

            case KEYBOARD_CODES.ESC:
                $scope.cancelTagging();
            break;
        }
    };

    $scope.setFocusIndex = function(index) {
        $scope.focusIndex = Math.min(Math.max(-1, index), $scope.filteredTags.length - 1);
    };
}

export default CustomTagsDropdownController;
