import FieldDefinition from '../definition';
import FieldController from '../controller';

var Dropdown = angular.module('Field.Dropdown', []);

class DropdownFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
FieldController.$inject = ['$scope'];

class DropdownFieldDefinition extends FieldDefinition{
    constructor() {
        super();
        this.controller = DropdownFieldController;
    }
}

let definition = new DropdownFieldDefinition();

Dropdown.directive('dropdownField', () => definition);

export default Dropdown;
