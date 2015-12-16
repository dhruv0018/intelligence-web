import FieldDefinition from '../directive';
import PeriodFieldController from './controller';

class PeriodFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = PeriodFieldController;
    }
}

export default PeriodFieldDefinition;
