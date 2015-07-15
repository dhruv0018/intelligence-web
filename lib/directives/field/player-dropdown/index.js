import FieldDefinition from '../definition';
import FieldController from '../controller';
import FieldTemplate from './template.html.js';
import dropdownTemplate from './player-dropdown-input.html.js';

var PlayerDropdown = angular.module('Field.PlayerDropdown', []);

class PlayerFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
PlayerFieldController.$inject = ['$scope'];

PlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('field/player-dropdown-input.html', dropdownTemplate);
    }
]);


class PlayerFieldDefinition extends FieldDefinition{
    constructor() {
        super();
        this.controller = PlayerFieldController;
        this.template = FieldTemplate;
    }
}


let definition = new PlayerFieldDefinition();

PlayerDropdown.directive('playerDropdownField', () => definition);

export default PlayerDropdown;
