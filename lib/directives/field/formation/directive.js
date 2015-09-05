import FieldDefinition from '../directive';
import FormationFieldController from './controller';

class FormationFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = FormationFieldController;
    }
}

export default FormationFieldDefinition;
