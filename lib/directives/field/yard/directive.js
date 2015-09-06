import FieldDefinition from '../directive';
import YardFieldController from './controller';

class YardFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = YardFieldController;
    }
}

export default YardFieldDefinition;
