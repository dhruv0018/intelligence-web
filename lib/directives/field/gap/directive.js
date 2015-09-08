import FieldDefinition from '../directive';
import GapFieldController from './controller';

class GapFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = GapFieldController;
    }
}

export default GapFieldDefinition;
