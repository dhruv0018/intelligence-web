import SelfEditedPlaysFilter from '../services/self-edited-plays-filter';
import SELF_EDITOR_FILTERS from './constants.js';

const dependencies = [
    '$scope',
    'SelfEditedPlaysFilter',
    'PlaylistEventEmitter',
    'CUSTOM_TAGS_EVENTS',
    'CustomtagsFactory',
    'UsersFactory',
    'Utilities'
];

function SelfEditedPlaysFiltersController (
    scope,
    selfEditedPlaysFilter,
    playlistEventEmitter,
    CUSTOM_TAGS_EVENTS,
    customtags,
    users,
    utilities
) {
    const teamId = scope.game.uploaderTeamId;
    const tags = customtags.getList({ teamId });

    const getAvailableFilters = () => {
        scope.filtersList = [];
        scope.appliedTags = [];
        let userIds = [];
        scope.allPlays.map(play => {
            userIds.push(play.createdByUserId);
            if(play.customTagIds.length > 0) {
                play.customTagIds.forEach(tag => {
                    scope.appliedTags.push(tag);
                });
            }
        });
        scope.createdByUserIds = utilities.unique(userIds);
        scope.filtersList[SELF_EDITOR_FILTERS.CREATED_BY] = users.getList(userIds);
        scope.filtersList[SELF_EDITOR_FILTERS.TAGS] = customtags.getList(scope.appliedTags);
    };

    /**
     * @param {KrossoverPlay} play
     * @returns {Boolean}
     */
    const filterPlays = (play) => {
        return scope.activeFilters.every((filter) => {
            if (filter.id === SELF_EDITOR_FILTERS.TAGS) {
                return (play.customTagIds.indexOf(filter.value.id) >= 0);
            } else if (filter.id === SELF_EDITOR_FILTERS.CREATED_BY) {
                return (play.createdByUserId == filter.value.id);
            }
        });
    };


    scope.filterMenu = {
        isOpen : false
    };
    scope.allPlays = scope.plays.data;
    scope.filtersList = [];
    scope.appliedTags = [];
    scope.createdByUserIds = [];
    scope.activeFilters = [];
    scope.SELF_EDITOR_FILTERS = SELF_EDITOR_FILTERS;
    scope.currentFilter = SELF_EDITOR_FILTERS.TAGS;
    getAvailableFilters();

    playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, getAvailableFilters);
    scope.$on('self-edited-play-start-notifier-reset-to-default-mode', getAvailableFilters);
    scope.$on('self-edited-play-start-notifier-reset-to-editor-mode', clearAll);

    scope.showFilter = function($event, filter) {
        $event.preventDefault();
        $event.stopPropagation();
        scope.filterMenu.isOpen = true;
        scope.currentFilter = filter;
        scope.searchFilter = {}; // Reset searchbar
    };

    scope.setActiveFilter = function(filterId, filterValue) {
        if (isFilterActive(filterId, filterValue)) {
            return;
        }
        scope.activeFilters.push({
            id : filterId,
            value : filterValue
        });
        selfEditedPlaysFilter.notifySelectedFilter(filterPlays);
    };

    scope.removeActiveFilter = function(index) {
        scope.activeFilters.splice(index, 1);
        if (scope.activeFilters.length) {
            selfEditedPlaysFilter.notifySelectedFilter(filterPlays);
        } else {
            selfEditedPlaysFilter.notifyFiltersCleared();
        }
    };

    function clearAll() {
        scope.activeFilters = [];
        selfEditedPlaysFilter.notifyFiltersCleared();
    }

    function isFilterActive(filterId, filterValue) {
        return scope.activeFilters.some(activeFilter => (activeFilter.id === filterId && activeFilter.value === filterValue));
    }

    scope.clearAll = clearAll;
    scope.isFilterActive = isFilterActive;
}

SelfEditedPlaysFiltersController.$inject = dependencies;

export default SelfEditedPlaysFiltersController;
