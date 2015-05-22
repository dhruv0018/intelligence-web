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
    'PLAYLIST_EVENTS',
    'CUSTOM_TAGS_EVENTS'
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
    PLAYLIST_EVENTS,
    CUSTOM_TAGS_EVENTS
) {
    $scope.customTags = customtags.getList();
    $scope.filters = {};
    $scope.selectedTags = []; // tags to be applied
    $scope.availableTags = []; // tags available to select (all tags minus selected ones)
    $scope.filteredTags = []; // available tags filtered by search input

    $scope.$watch('selectedTags.length', updateAvailableTags);

    $scope.selectTag = function(tag) {
        $scope.selectedTags.push(tag);
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
        //Returns tag if there is a match
        return $scope.customTags.find( tag => {
            return tag.name === name;
        });
    };

    $scope.cancelTagging = function() {
        $scope.clearTagFilter();
        $scope.selectedTags = []; // clear selected tags
    };

    $scope.keyPressTracker = function(keyEvent, name) {
        if (keyEvent.which === 13) $scope.createNewTag(name);
    };

    $scope.clearTagFilter = function() {
        $scope.filters = {};
        $scope.updateFilteredTags();
    };

    $scope.applyTags = function() {
        customtags.batchSave($scope.selectedTags).then( tags => {
            $scope.selectedTags = tags;
            $scope.selectedTagIds = $scope.selectedTags.map(tag => tag.id);
            $scope.customTags = customtags.getList();

            // Add custom tag ids to each play with no duplicates
            // TODO: use set?
            $scope.plays.forEach(play => {
                $scope.selectedTagIds.forEach(tagId => {
                    if (play.customTagIds.indexOf(tagId) == -1) {
                        play.customTagIds.push(tagId);
                    }
                });
            });

            let customTagEvent = {
                updatedPlayIds: []
            };

            // Save plays as a batch
            plays.batchSave($scope.plays).then(function deselectPlays() {
                $scope.plays.forEach(play => {
                    play.isSelected = false;
                    customTagEvent.updatedPlayIds.push(play.id);
                });
                $scope.cancelTagging();

                playlistEventEmitter.emit(CUSTOM_TAGS_EVENTS.SAVE, customTagEvent);
                playlistEventEmitter.emit(PLAYLIST_EVENTS.SELECT_PLAY_EVENT);
            });
        });

    };
}

export default CustomTagsDropdownController;
