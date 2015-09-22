const angular = window.angular;

function isPlaylistEmpty() {
    const injector = angular.element(document).injector();
    const playsManager = injector.get('PlaysManager');
    return playsManager.plays.length === 0;
}

function restrictToPeriodTags(tags) {
    return isPlaylistEmpty() ? tags.filter(tag => tag.isPeriodTag) : tags;
}

export default restrictToPeriodTags;
