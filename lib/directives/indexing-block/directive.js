/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */

const templateUrl = 'indexing-block/template.html';

/**
* IndexingBlockDirective dependencies
*/
IndexingBlockDirective.$inject = [
'VideoPlayerEventEmitter',
'VIDEO_PLAYER_EVENTS'
];

/**
 * IndexingBlock Directive
 * @module IndexingBlock
 * @name IndexingBlock
 * @type {directive}
 */
function IndexingBlockDirective (
videoPlayerEventEmitter,
VIDEO_PLAYER_EVENTS
) {

const definition = {

    restrict: TO += ELEMENT,

    templateUrl
};

return definition;
}

export default IndexingBlockDirective;
