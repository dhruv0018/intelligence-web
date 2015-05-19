/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* CustomTagsDropdown dependencies
*/
CustomTagsDropdownController.$inject = [
    '$scope',
    '$filter',
    '$timeout',
    'CustomtagsFactory',
    'TeamsFactory',
    'PlaysFactory',
    'SessionService',
    'PlaylistEventEmitter',
    'PLAYLIST_EVENTS'
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
    $timeout,
    customtags,
    teams,
    plays,
    session,
    playlistEventEmitter,
    PLAYLIST_EVENTS
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
        customtags.batchSave($scope.selectedTags).then(function(tags) {
            $scope.selectedTags = tags;
            $scope.selectedTagIds = $scope.selectedTags.map(tag => tag.id);

            // Add custom tag ids to each play with no duplicates
            // TODO: use set?
            $scope.plays.forEach(play => {
                $scope.selectedTagIds.forEach(tagId => {
                    if (play.customTagIds.indexOf(tagId) == -1) {
                        play.customTagIds.push(tagId);
                    }
                });
            });

            // Save plays as a batch
            plays.batchSave($scope.plays).then(function() {
                $scope.plays.forEach(play => {
                    play.isSelected = false;
                    playlistEventEmitter.emit(PLAYLIST_EVENTS.SELECT_PLAY_EVENT);
                });
                $scope.cancelTagging();

                $scope.$emit('confirmTagSave', true);
                // Show confirmation that tags were save for 2 seconds
                $timeout(function() {
                    $scope.$emit('confirmTagSave', false);
                }, 2000);
            });
        });

    };
}

export default CustomTagsDropdownController;
