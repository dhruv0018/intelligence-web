import FieldDefinition from '../directive';
import DropdownFieldController from './controller';

class DropdownFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = DropdownFieldController;
    }
}

export default DropdownFieldDefinition;
