import FieldDefinition from '../directive';
import FieldController from '../controller';

const TextDropdown = angular.module('Field.TextDropdown', []);

class TextFieldController extends FieldController {
    constructor(scope) {
        super(scope);
    }
}
TextFieldController.$inject = ['$scope'];

class TextFieldDefinition extends FieldDefinition {
    constructor() {
        super();
        this.controller = TextFieldController;
    }
}

let definition = new TextFieldDefinition();

TextDropdown.directive('textDropdownField', () => definition);

export default TextDropdown;
