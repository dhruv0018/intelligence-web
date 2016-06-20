import SelfEditedPlaysFilter from '../../features/self-editor/services/self-edited-plays-filter';

const dependencies = [
    '$scope',
    'SelfEditedPlaysFilter',
    'PlaylistEventEmitter',
    'CUSTOM_TAGS_EVENTS',
    'CustomtagsFactory'
];

function CustomTagsFilterController (
    scope,
    selfEditedPlaysFilter,
    playlistEventEmitter,
    CUSTOM_TAGS_EVENTS,
    customtags
) {

    const teamId = scope.game.uploaderTeamId;
    const tags = customtags.getList({ teamId });

    const getAppliedTags = () => {
        scope.appliedTags = [];
        scope.allPlays.map(play => {
            if(play.customTagIds.length > 0) {
                const playIndex = scope.allPlays.indexOf(play) + 1;
                play.playIndex = playIndex;
                play.customTagIds.forEach(tag => {
                    scope.appliedTags.push(tag);
                });
            }
        });
    };

    /**
     * @param {KrossoverPlay} play
     * @returns {Boolean} true if selectedTags[] is a subset of play's customTags[]
     */
    const filterPlayBySelectedTags = (play) => {
        return scope.selectedTags
            .map(tag => tag.id)
            .every(tagId => play.customTagIds.indexOf(tagId) >= 0);
    };

    const updateAvailableTags = () => {
        getAppliedTags();
        scope.tags = customtags.getList(scope.appliedTags);
    };

    scope.showDropdown = false;
    scope.toggleDropdown = toggleDropdown;
    scope.selectTag = selectTag;
    scope.removeTag = removeTag;
    scope.clearTags = clearTags;
    scope.allPlays = scope.plays.data;
    scope.appliedTags = [];
    scope.selectedTags = [];

    getAppliedTags();
    scope.tags = customtags.getList(scope.appliedTags);

    playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, updateAvailableTags);
    scope.$on('self-edited-play-start-notifier-reset-to-editor-mode', clearTags);

    window.onclick = function(e) {
        if (e.target.className !== 'dropdown-title' && e.target.parentElement.className !== 'dropdown-title' && e.target.className.indexOf('plays-filter-search') === -1){
            scope.showDropdown = false;
            scope.$apply();
        }
    };

    function toggleDropdown() {
        scope.showDropdown = !scope.showDropdown;
    }

    function selectTag(tag) {
        scope.selectedTags.push(tag);
        selfEditedPlaysFilter.notifySelectedFilter(filterPlayBySelectedTags);
    }

    function removeTag(tag) {
        let tags = scope.selectedTags;
        tags.splice(tags.indexOf(tag), 1);

        if (tags.length) {

            selfEditedPlaysFilter.notifySelectedFilter(filterPlayBySelectedTags);
        } else {

            selfEditedPlaysFilter.notifyFiltersCleared();
        }
    }

    function clearTags() {
        scope.selectedTags = [];
        selfEditedPlaysFilter.notifyFiltersCleared();
    }
}

CustomTagsFilterController.$inject = dependencies;

export default CustomTagsFilterController;
