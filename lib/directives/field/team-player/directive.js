import FieldDefinition from '../directive';
import TeamPlayerFieldController from './controller';
import TeamPlayerFieldTemplate from './template';
import dropdownTemplate from './dropdown-input.html';
const dropdownTemplateUrl = 'field/team-player-dropdown-input.html';

const fieldTemplate = new TeamPlayerFieldTemplate(dropdownTemplateUrl, dropdownTemplate);

class TeamPlayerFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = TeamPlayerFieldController;
        this.template = fieldTemplate.template;
    }
}

export {
    TeamPlayerFieldDefinition,
    fieldTemplate
};
