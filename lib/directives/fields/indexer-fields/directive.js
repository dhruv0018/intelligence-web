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
            onBackward: '=', // TODO: This and onForward should probably be & not = since they are functions
            onForward: '='
        };
    }
}

/**
* IndexerFieldsDirective dependencies
*/
IndexerFieldsDirective.$inject = [];

export default IndexerFieldsDirective;
