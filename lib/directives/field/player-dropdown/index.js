let dropdownTemplateUrl = 'field/player-dropdown-input.html';
let PlayerDropdown = angular.module('Field.PlayerDropdown', []);

import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from './template.html.js';
import dropdownTemplate from './player-dropdown-input.html.js';

class PlayerFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

class PlayerFieldDefinition extends FieldDefinition{

    constructor() {

        super();

        this.controller = PlayerFieldController;
        this.template = FieldTemplate;
    }
}

PlayerFieldController.$inject = ['$scope'];

PlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(dropdownTemplateUrl, dropdownTemplate);
    }
]);


let definition = new PlayerFieldDefinition();

PlayerDropdown.directive('playerDropdownField', () => definition);

export default PlayerDropdown;
