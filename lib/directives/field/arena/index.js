import FieldDefinition from '../definition';
import ArenaFieldController from './controller';
import FieldTemplate from './template.html.js';

const ArenaDropdown = angular.module('Field.Arena', []);

class ArenaFieldDefinition extends FieldDefinition {

    constructor() {

        super();

        this.controller = ArenaFieldController;
        this.link = () => {};
        this.template = FieldTemplate;
    }
}

let definition = new ArenaFieldDefinition();

ArenaDropdown.directive('arenaDropdownField', () => definition);

export default ArenaDropdown;
