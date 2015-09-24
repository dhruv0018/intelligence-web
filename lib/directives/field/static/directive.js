import FieldDefinition from '../directive';
import StaticFieldTemplate from './template.html';

class StaticFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.template = StaticFieldTemplate;
    }
}

export default StaticFieldDefinition;
