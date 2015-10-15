import FieldDefinition from '../directive';
import YardFieldController from './controller';
import YardFieldTemplate from './template.html';

class YardFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = YardFieldController;
        this.template = YardFieldTemplate;
    }
}

export default YardFieldDefinition;
