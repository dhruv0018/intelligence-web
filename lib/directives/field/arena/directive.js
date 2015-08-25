import FieldDefinition from '../directive';
import ArenaFieldController from './controller';
import ArenaFieldTemplate from './template.html';

class ArenaFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = ArenaFieldController;
        this.link = () => {};
        this.template = ArenaFieldTemplate;
    }
}

export default ArenaFieldDefinition;
