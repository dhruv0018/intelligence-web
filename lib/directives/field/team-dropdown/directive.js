import FieldDefinition from '../directive';
import TeamFieldController from './controller';

class TeamFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = TeamFieldController;
    }
}

export default TeamFieldDefinition;
