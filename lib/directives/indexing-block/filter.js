function tagsRulesFilter(playsManager) {

    function isPlaylistEmpty() {
        return playsManager.plays.length === 0;
    }

    function restrictToPeriodTags(tags) {
        return isPlaylistEmpty() ? tags.filter(tag => tag.isPeriodTag) : tags;
    }

    return restrictToPeriodTags;
}

tagsRulesFilter.$inject = ['PlaysManager'];

export default tagsRulesFilter;
