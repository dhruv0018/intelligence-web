/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import controller from './controller';

const templateUrl = 'indexing-block/template.html';

/**
* IndexingBlockDirective dependencies
*/
IndexingBlockDirective.$inject = [];

/**
 * IndexingBlock Directive
 * @module IndexingBlock
 * @name IndexingBlock
 * @type {directive}
 */
function IndexingBlockDirective (
) {

    const definition = {

        restrict: TO += ELEMENT,

        templateUrl,

        controller
    };

    return definition;
}

export default IndexingBlockDirective;
