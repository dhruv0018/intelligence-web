function tagsRulesFilter(playsManager) {

    function isPlaylistEmpty() {
        return playsManager.plays.length === 0;
    }

    function restrictToPeriodTags(tags) {
        if (isPlaylistEmpty()) {
            tags.current = tags.current.filter(tag => tag.isPeriodTag);
        }
        return tags;
    }

    return restrictToPeriodTags;
}

tagsRulesFilter.$inject = ['PlaysManager'];

export default tagsRulesFilter;
