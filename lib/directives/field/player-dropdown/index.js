//jshint ignore: start
let dropdownTemplateUrl = 'field/player-dropdown-input.html';
let PlayerDropdown = angular.module('Field.PlayerDropdown', []);

import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from './template.html.js';
import dropdownTemplate from './dropdown-input.html.js';

let template = FieldTemplate(dropdownTemplateUrl);

PlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(dropdownTemplateUrl, dropdownTemplate);
    }
]);

class PlayerFieldController extends FieldController {

    constructor(scope) {

        super(scope);
    }
}

class PlayerFieldDefinition extends FieldDefinition{

    constructor() {

        super();

        this.controller = PlayerFieldController;
        this.template = template;
    }
}

PlayerFieldController.$inject = ['$scope'];


let definition = new PlayerFieldDefinition();

PlayerDropdown.directive('playerDropdownField', () => definition);

export default PlayerDropdown;
