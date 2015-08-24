import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from '../template.js';
import dropdownTemplate from './dropdown-input.html.js';

let dropdownTemplateUrl = 'field/player-dropdown-input.html';
let PlayerDropdown = angular.module('Field.PlayerDropdown', []);

class PlayerFieldTemplate extends FieldTemplate {
    constructor(dropdownTemplateUrl, dropdownTemplate){
        super(dropdownTemplateUrl, dropdownTemplate);
    }
}

let fieldTemplate = new PlayerFieldTemplate(dropdownTemplateUrl, dropdownTemplate);

class PlayerFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}
PlayerFieldController.$inject = ['$scope'];

class PlayerFieldDefinition extends FieldDefinition{

    constructor() {

        super();

        this.controller = PlayerFieldController;
        this.template = fieldTemplate.template;
    }
}

let definition = new PlayerFieldDefinition();


PlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(fieldTemplate.dropdownTemplateUrl, fieldTemplate.dropdownTemplate);
    }
]);

PlayerDropdown.directive('playerDropdownField', () => definition);

export default PlayerDropdown;
