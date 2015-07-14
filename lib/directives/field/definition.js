/* Component resources */
import FieldLink from './link.js';
import FieldTemplate from './template.html.js';
import FieldController from './controller.js';

class FieldDefinition {
    constructor (controller, link, template, restrict, scope) {
        this.controller = controller || FieldController;
        this.template = template || FieldTemplate;
        this.restrict = restrict || 'E';
        this.link = link || FieldLink;
        this.scope = scope || {field: '=', event: '='};
    }
}

export default FieldDefinition;
