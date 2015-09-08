/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import UserFieldsController from './controller';
import UserFieldsTemplate from './template';

/**
 * UserFields Directive
 * @module UserFields
 * @name UserFields
 * @type {Directive}
 */
class UserFieldsDirective {

    constructor () {

        this.restrict = TO += ELEMENT;
        this.template = UserFieldsTemplate;
        this.controller = UserFieldsController;
        this.link = {};
        this.scope = {

            event: '='
        };
    }
}

/**
* UserFieldsDirective dependencies
*/
UserFieldsDirective.$inject = [];

export default UserFieldsDirective;
