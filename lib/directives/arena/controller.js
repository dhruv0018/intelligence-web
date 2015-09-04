/**
 * Arena directive Controller function
 * @module Arena
 */
function arenaController(scope) {

    scope.region = scope.region || {};

    if (!scope.hasOwnProperty('highlightRegions')) scope.highlightRegions = true;

    /**
     * @method arenaController.mapRegions
     * @description Creates an array of objects with a selector and the constant key
     * Used to iterate over regions and bind click handlers
     * @param {Object} regionsConstant - ARENA_REGIONS._SPORT_NAME_ constant
     * BASKETBALL: {
     *
     *     'AROUND_THE_RIM': {
     *         id: 1,
     *         name: 'Around the Rim',
     *         description: 'around the rim'
     *     },
     *
     *     'INSIDE_THE_PAINT': {
     *         id: 2,
     *         name: 'Inside the Paint',
     *         description: 'from inside the paint'
     *     }
     * }
     * @returns {Array<Object>} regions - region key/selector map
     * [
     *     {
     *         'arenaKey': 'AROUND_THE_RIM',
     *         'arenaSelector': '.around-the-rim'
     *     },
     *     {
     *         'arenaKey': 'INSIDE_THE_PAINT',
     *         'arenaSelector': '.inside-the-paint'
     *     }
     * ]
     */
    this.mapRegions = function (regionsConstant) {

        return Object.keys(regionsConstant).map(key => {

            let selector = '.' + key.toLowerCase().replace(/_/g, '-');

            return {
                'arenaKey': key,
                'arenaSelector': selector
            };
        });
    };

    /**
     * @method arenaController.bindClickListeners
     * @description Binds click handlers to arena SVG elements
     * @param {Object} element - parent element to query for regions on
     * @param {Object} regionsConstant - ARENA_REGIONS._SPORT_NAME_ constant
     * @param {Object} scope - element's scope
     */
    this.bindClickListeners = function(element, regionsConstant, scope) {

        function onClick(regionKey) {

            scope.$apply(() => {

                scope.region.id = regionsConstant[regionKey].id;
            });
        }

        const regions = this.mapRegions(regionsConstant);

        /**
         * FIXME:
         * Should use event delegation but requires refactoring of arena
         * templates - n^2 complexity :(
         * https://github.com/krossoverintelligence/intelligence-web/issues/115
         */
        regions.forEach(region => {

            const elements = element.querySelectorAll(region.arenaSelector);

            Array
                .from(elements)
                .forEach(element =>
                    element.addEventListener('click', () =>
                        onClick(region.arenaKey)
                    )
                );
        });
    };
}

export default arenaController;
