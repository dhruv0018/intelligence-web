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

        customtags.query({ teamId }).then(tags => {
            scope.tags = tags.sort( (a, b) => {
                return a.name.localeCompare(b.name);
            });
        });
    };

    scope.showDropdown = false;
    scope.tags = tags.sort( (a, b) => a.name.localeCompare(b.name) );
    scope.toggleDropdown = toggleDropdown;
    scope.selectTag = selectTag;
    scope.removeTag = removeTag;
    scope.clearTags = clearTags;
    scope.selectedTags = [];

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
