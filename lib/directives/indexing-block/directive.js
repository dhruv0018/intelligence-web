/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */

const templateUrl = 'indexing-block/template.html';

import IndexerBlockController from './controller';

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

    templateUrl,

    controller: IndexerBlockController
};

return definition;
}

export default IndexingBlockDirective;
