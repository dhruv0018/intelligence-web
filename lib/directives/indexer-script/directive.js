/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import IndexerScriptController from './controller';
import IndexerScriptTemplate from './template.html';
import { IndexerScriptTemplateUrl } from './index';

/**
 * IndexerScript Directive
 * @module IndexerScript
 * @name IndexerScript
 * @type {Directive}
 */

class IndexerScriptDirective {

    constructor () {

        this.restrict = TO += ELEMENT;
        this.template = IndexerScriptTemplate;
        this.controller = IndexerScriptController;
        this.link = {};
        this.scope = {

            event: '=',
            onBackward: '=',
            onForward: '='
        };
    }
}

/**
* IndexerScriptDirective dependencies
*/
IndexerScriptDirective.$inject = [];

export default IndexerScriptDirective;
