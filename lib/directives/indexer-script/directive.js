/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import IndexerScriptController from './controller';
import IndexerScriptTemplate from './template.html';
import { IndexerScriptTemplateUrl } from './index';
import IndexerScriptLink from './link';

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
        this.link = {
            post: IndexerScriptLink
        };
        this.scope = {

            event: '=',
            save: '&',
            back: '&',
            next: '&'
        };
    }
}

/**
* IndexerScriptDirective dependencies
*/
IndexerScriptDirective.$inject = [];

export default IndexerScriptDirective;
