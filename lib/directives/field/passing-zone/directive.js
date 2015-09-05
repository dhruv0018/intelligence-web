import FieldDefinition from '../directive';
import PassingZoneFieldController from './controller';

class PassingZoneFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = PassingZoneFieldController;
    }
}

export default PassingZoneFieldDefinition;
