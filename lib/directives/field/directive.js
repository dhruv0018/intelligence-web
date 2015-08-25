/* Component resources */
import FieldTemplate from './template.js';
import FieldController from './controller.js';
class FieldDefinition {
    constructor (template, controller, link, restrict, scope) {
        this.template = template || new FieldTemplate().template;
        this.controller = controller || FieldController;
        this.restrict = restrict || 'E';
        this.link = link || {};
        this.scope = scope || {
            field: '=',
            // Event is optional for static fields
            event: '=?',
            autofocus: '=?'
        };
    }
}

export default FieldDefinition;
