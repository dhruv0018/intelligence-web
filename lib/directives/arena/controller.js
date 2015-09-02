/**
 * Arena directive Controller function
 * @module Arena
 */
function arenaController(scope) {

    scope.region = scope.region || {};

    scope.highlightRegions = scope.highlightRegions || true;

    /**
     * @method arenaController.mapRegions
     * @description Creates an array of objects with a selector and the constant key
     * Used to iterate over regions and bind click handlers
     * @param ARENA_REGIONS._SPORT_NAME_ constant
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
     * @returns region key/selector map
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
    this.mapRegions = function (regionConstant) {

        let regions = [];

        Object.keys(regionConstant).forEach(key => {

            let selector = '.' + key.toLowerCase().replace(/_/g, '-');
            let data = {
                'arenaKey': key,
                'arenaSelector': selector
            };
            regions.push(data);
        });

        return regions;
    };

    /**
     * @method arenaController.bindClickListeners
     * @description Binds click handlers to arena SVG elements
     * @param parent element to query for regions on
     * @param ARENA_REGIONS._SPORT_NAME_ constant
     * @param callback handler for click event listener
     */
    this.bindClickListeners = function(element, regionsConstant, onClick) {

        const regions = this.mapRegions(regionsConstant);

        regions.forEach(region => {

            const elements = element.querySelectorAll(region.arenaSelector);

            /*jshint loopfunc: true */
            /*eslint no-loop-func: 0 */
            for (let i = 0; i < elements.length; i++) {

                elements[i].addEventListener('click', () => onClick(region.arenaKey));
            }
        });
    };
}

export default arenaController;
