/* Component resources */
import FieldLink from './link.js';
import FieldTemplate from './template.html.js';
import FieldController from './controller.js';

class FieldDefinition {
    constructor (template, controller, link, restrict, scope) {
        this.template = template || FieldTemplate;
        this.controller = controller || FieldController;
        this.restrict = restrict || 'E';
        this.link = link || FieldLink;
        this.scope = scope || {field: '=', event: '='};
    }
}

export default FieldDefinition;
