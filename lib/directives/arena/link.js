/**
 * Arena directive Link function
 * @module Arena
 */
function arenaLink(scope) {

    scope.region = scope.region || {};

    if (!scope.hasOwnProperty('highlightRegions')) scope.highlightRegions = true;
}

export default arenaLink;
