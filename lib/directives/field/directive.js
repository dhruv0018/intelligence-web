/* Component resources */
import FieldTemplate from './template';
import FieldController from './controller';

class FieldDefinition {

    constructor (template, controller, link, restrict, scope) {

        this.template = template || new FieldTemplate().template;
        this.controller = controller || FieldController;
        this.restrict = restrict || 'E';
        this.link = link || {};
        this.scope = scope || {
            field: '='
        };
    }
}

export default FieldDefinition;
