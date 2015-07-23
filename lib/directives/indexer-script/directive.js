/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import controller from './controller';
import template from './template.html';
import { templateUrl } from './index';

/**
 * IndexerScript Directive
 * @module IndexerScript
 * @name IndexerScript
 * @type {Directive}
 */

class IndexerScriptDirective {

    constructor () {

        this.restrict = TO += ELEMENT;
        this.template = template;
        this.controller = controller;
        this.scope = {

            event: '='
        };
    }
}

/**
* IndexerScriptDirective dependencies
*/
IndexerScriptDirective.$inject = [];

export default IndexerScriptDirective;
