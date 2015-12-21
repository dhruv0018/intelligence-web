import FieldDefinition from '../directive';
import TeamFieldController from './controller';
import dropdownTemplate from './dropdown-input.html';
const dropdownTemplateUrl = 'field/team-dropdown-input.html';
import TeamFieldTemplate from './template';

const fieldTemplate = new TeamFieldTemplate(dropdownTemplateUrl, dropdownTemplate);
class TeamFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = TeamFieldController;
        this.template = fieldTemplate.template;
    }
}

export {
    TeamFieldDefinition,
    fieldTemplate
};
