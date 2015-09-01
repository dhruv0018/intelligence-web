/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import IndexerFieldsController from './controller';
import IndexerFieldsTemplate from './template';
import IndexerFieldsLink from './link';

/**
 * IndexerFields Directive
 * @module IndexerFields
 * @name IndexerFields
 * @type {Directive}
 */

class IndexerFieldsDirective {

    constructor () {

        this.restrict = TO += ELEMENT;
        this.template = IndexerFieldsTemplate;
        this.controller = IndexerFieldsController;
        this.link = IndexerFieldsLink;
        this.scope = {

            event: '=',
            onBackward: '=',
            onForward: '='
        };
    }
}

/**
* IndexerFieldsDirective dependencies
*/
IndexerFieldsDirective.$inject = [];

export default IndexerFieldsDirective;
