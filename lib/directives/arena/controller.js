/**
 * Arena directive Controller function
 * @module Arena
 */
function arenaController(scope) {

    scope.region = scope.region || {};

    if (!scope.hasOwnProperty('highlightRegions')) scope.highlightRegions = true;
}

export default arenaController;
