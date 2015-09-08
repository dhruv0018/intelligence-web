import FieldDefinition from '../directive';
import PlayerFieldController from './controller';
import PlayerFieldTemplate from './template';
import dropdownTemplate from './dropdown-input.html';
const dropdownTemplateUrl = 'field/player-dropdown-input.html';

const fieldTemplate = new PlayerFieldTemplate(dropdownTemplateUrl, dropdownTemplate);

class PlayerFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = PlayerFieldController;
        this.template = fieldTemplate.template;
    }
}

export {
    PlayerFieldDefinition,
    fieldTemplate
};
